const jwt = require("jsonwebtoken");
const Joi = require("joi");
const db = require("../util/database");
const dotenv = require("dotenv");
dotenv.config();

class Variant {
    constructor(variantDetails) {
        this.product_id = variantDetails.product_id;
        this.variants = variantDetails.variants;
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

    static getVariant(variantId) {
        const get_variant_query =
            "select variant_name, price, quantity from variant where variant_id=?";
        return db.execute(get_variant_query, [variantId]);
    }

    async saveAll() {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();
            await this.saveVariants(connection);
            await connection.commit();
        } catch (e) {
            await connection.rollback();
            await connection.release();
            throw e;
        }

        await connection.release();
    }

    async saveVariants(connection) {
        for (const variant of this.variants) {
            const { options, price, quantity, variant_name } = variant;

            const insert_variant_query =
                "insert into variant (product_id, variant_name, price, quantity) values (?, ?, ?, ?)";
            const result = await connection.execute(insert_variant_query, [
                this.product_id,
                variant_name,
                price,
                quantity,
            ]);
            variant.variant_id = result[0].insertId;
            connection.unprepare(insert_variant_query);

            await this.saveVariantValues(
                connection,
                variant.variant_id,
                options
            );
        }
    }

    async saveVariantValues(connection, variantId, options) {
        for (const option of options) {
            const { option_id, value_id } = option;

            const insert_variant_value_query =
                "insert into variant_values (product_id, variant_id, option_id, value_id) values (?, ?, ?, ?)";
            await connection.execute(insert_variant_value_query, [
                this.product_id,
                variantId,
                option_id,
                value_id,
            ]);
            connection.unprepare(insert_variant_value_query);
        }
    }
}

module.exports.Variant = Variant;
