const db = require("../util/database");
const dotenv = require("dotenv");
dotenv.config();

class Variant {
    constructor(variantDetails) {
        this.product_id = variantDetails.product_id;
        this.variant_id = variantDetails.variant_id;
        this.options = variantDetails.options;
        this.price = variantDetails.price;
        this.quantity = variantDetails.quantity;
        this.variant_name = variantDetails.variant_name;
    }

    static getVariantIds(productId, optionId, valueId, ids) {
        let get_variant_ids_query =
            "select variant_id from variant_values where product_id=? and option_id=? and value_id=?";

        if (ids) {
            get_variant_ids_query +=
                " and variant_id in (" + ids.join(", ") + ")";
        }

        return db.execute(get_variant_ids_query, [
            productId,
            optionId,
            valueId,
        ]);
    }

    static async getVariant(variantId) {
        const get_variant_query =
            "select variant_id, variant_name, price, quantity from variant where variant_id=?";
        const [variant, _] = await db.execute(get_variant_query, [variantId]);
        return variant[0];
    }

    async save() {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();
            await this.saveVariant(connection);
            await connection.commit();
        } catch (e) {
            await connection.rollback();
            await connection.release();
            throw e;
        }

        await connection.release();
    }

    async saveVariant(connection) {
        const insert_variant_query =
            "insert into variant (product_id, variant_name, price, quantity) values (?, ?, ?, ?)";
        const result = await connection.execute(insert_variant_query, [
            this.product_id,
            this.variant_name,
            this.price,
            this.quantity,
        ]);
        this.variant_id = result[0].insertId;
        connection.unprepare(insert_variant_query);

        await this.saveVariantValues(connection);
    }

    async saveVariantValues(connection) {
        for (const option of this.options) {
            const { option_id, value_id } = option;

            const insert_variant_value_query =
                "insert into variant_values (product_id, variant_id, option_id, value_id) values (?, ?, ?, ?)";
            await connection.execute(insert_variant_value_query, [
                this.product_id,
                this.variant_id,
                option_id,
                value_id,
            ]);
            connection.unprepare(insert_variant_value_query);
        }
    }

    async update() {
        const {
            variant_name: old_name,
            price: old_price,
            quantity: old_quantity,
        } = await Variant.getVariant(this.variant_id);

        if (
            this.variant_name !== old_name ||
            this.price !== old_price ||
            this.quantity !== old_quantity
        ) {
            const update_variant_query =
                "update variant set variant_name=?, price=?, quantity=? where variant_id=?";
            await db.execute(update_variant_query, [
                this.variant_name,
                this.price,
                this.quantity,
                this.variant_id,
            ]);
        }
    }

    static async saveVariantImage(variantId, imageName) {
        const insert_image_query =
            "insert into variant_image (variant_id, image_name) values (?, ?)";
        await db.execute(insert_image_query, [variantId, imageName]);
    }

    static async fetchAllImages(variantId) {
        const get_all_images_query =
            "select image_name from variant_image where variant_id=?";
        return db.execute(get_all_images_query, [variantId]);
    }
}

module.exports.Variant = Variant;
