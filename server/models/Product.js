const _ = require("lodash");
const Joi = require("joi");
const db = require("../util/database");
const dotenv = require("dotenv");
dotenv.config();

class Product {
    constructor(productDetails) {
        this.product_id = productDetails.product_id;
        this.product_title = productDetails.product_title;
        this.sku = productDetails.sku;
        this.product_weight = productDetails.product_weight;
        this.custom_features = productDetails.custom_features;
        this.options = productDetails.options;
        this.category_id = productDetails.category_id;
        this.sub_category_id = productDetails.sub_category_id;
    }

    static #schema = {
        product_id: Joi.number().min(1).label("Product ID"),
        product_title: Joi.string()
            .required()
            .min(3)
            .max(250)
            .label("Product Title"),
        category_id: Joi.number().min(1).required().label("Category"),
        sub_category_id: Joi.number().min(1).required().label("Subcategory"),
        sku: Joi.string().required().min(5).max(30).label("SKU"),
        product_weight: Joi.number().required().min(1).label("Product Weight"),
        custom_features: Joi.array(),
        options: Joi.array(),
        isNew: Joi.bool(),
        image_name: Joi.string().allow(""),
    };

    static fetchAll() {
        const select_all_query = `
            select
                *
            from
                product p
                join variant v on p.default_variant_id = v.variant_id
                join product_category pc on p.product_id = pc.product_id
            where
                p.availability = 'AVAILABLE'
        `;

        return db.execute(select_all_query);
    }

    static fetchUnavailable() {
        const select_unavailable_query = `
            select
                p.product_id,
                p.product_title,
                p.sku,
                p.availability,
                p.default_variant_id,
                c.category_name,
                sc.sub_category_name
            from
                product p
                join product_category pc on p.product_id = pc.product_id
                join category c on pc.category_id = c.category_id
                join sub_category sc on pc.sub_category_id = sc.sub_category_id
            where
                p.availability = 'UNAVAILABLE'
                or p.default_variant_id is null
        `;

        return db.execute(select_unavailable_query);
    }

    static async getProductById(productId) {
        const product = await Product.getProduct(productId);

        if (product) {
            product.custom_features = await Product.getCustomFeatures(
                productId
            );
            product.options = await Product.getOptions(productId);
        }

        return product;
    }

    static async getProduct(productId) {
        const get_product_query = `
            select
                *
            from
                product p
                left outer join variant v on p.default_variant_id = v.variant_id
                join product_category pc on p.product_id = pc.product_id
            where
                p.product_id = ?
        `;

        const [products, _] = await db.execute(get_product_query, [productId]);

        if (products.length > 0) {
            return products[0];
        }

        return false;
    }

    static async getCustomFeatures(productId) {
        const get_custom_features_query = `
            select
                custom_feature_id,
                custom_feature_name,
                custom_feature_val
            from
                custom_feature
            where
                product_id = ?
        `;

        const [custom_features, _] = await db.execute(
            get_custom_features_query,
            [productId]
        );
        return custom_features;
    }

    static async getOptionValues(productId, optionId) {
        const get_option_values_query = `
            select
                value_id,
                value_name
            from
                variant_option_values
            where
                product_id = ?
                and option_id=?
        `;

        const option_values = await db.execute(get_option_values_query, [
            productId,
            optionId,
        ]);
        return option_values[0];
    }

    static async getOptions(productId) {
        const get_options_query = `
            select
                option_id,
                option_name
            from
                variant_option
            where
                product_id = ?
        `;

        let options = await db.execute(get_options_query, [productId]);
        options = options[0];
        for (const option of options) {
            option.values = await this.getOptionValues(
                productId,
                option.option_id
            );
        }
        return options;
    }

    static async getCustomFeature(customFeatureId) {
        const get_custom_feature_query = `
            select
                *
            from
                custom_feature
            where
                custom_feature_id = ?
        `;

        const [customFeature, _] = await db.execute(get_custom_feature_query, [
            customFeatureId,
        ]);
        return customFeature[0];
    }

    static async addCustomFeature(productId, customFeature) {
        const insert_custom_feature_query = `
            insert into custom_feature (product_id, custom_feature_name, custom_feature_val)
            values (?, ?, ?)
        `;

        const result = await db.execute(insert_custom_feature_query, [
            productId,
            customFeature.custom_feature_name,
            customFeature.custom_feature_val,
        ]);
        customFeature.custom_feature_id = result[0].insertId;
    }

    static async updateCustomFeature(customFeature) {
        const { custom_feature_id, custom_feature_name, custom_feature_val } =
            customFeature;
        const { custom_feature_name: old_name, custom_feature_val: old_val } =
            await Product.getCustomFeature(custom_feature_id);

        if (
            custom_feature_name !== old_name ||
            custom_feature_val !== old_val
        ) {
            const update_custom_feature_query = `
                update
                    custom_feature
                set
                    custom_feature_name = ?,
                    custom_feature_val = ?
                where
                    custom_feature_id = ?
            `;

            await db.execute(update_custom_feature_query, [
                custom_feature_name,
                custom_feature_val,
                custom_feature_id,
            ]);
        }
    }

    async save() {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();
            await this.saveProduct(connection);
            await this.saveCategory(connection);
            await this.saveCustomFeatures(connection);
            await this.saveOptions(connection);
            await connection.commit();
        } catch (e) {
            await connection.rollback();
            await connection.release();
            throw e;
        }

        await connection.release();
    }

    async saveProduct(connection) {
        const insert_product_query = `
            insert into product (product_title, sku, product_weight)
            values (?, ?, ?)
        `;

        const result = await connection.execute(insert_product_query, [
            this.product_title,
            this.sku,
            this.product_weight,
        ]);
        this.product_id = result[0].insertId;
        connection.unprepare(insert_product_query);
    }

    async saveCategory(connection) {
        const insert_product_category_query = `
            insert into product_category (product_id, category_id, sub_category_id)
            values (?, ?, ?)
        `;

        await connection.execute(insert_product_category_query, [
            this.product_id,
            this.category_id,
            this.sub_category_id,
        ]);
        connection.unprepare(insert_product_category_query);
    }

    async saveCustomFeatures(connection) {
        for (const custom_feature of this.custom_features) {
            const insert_custom_feature_query = `
                insert into custom_feature (product_id, custom_feature_name, custom_feature_val)
                values (?, ?, ?)
            `;

            const result = await connection.execute(
                insert_custom_feature_query,
                [
                    this.product_id,
                    custom_feature.custom_feature_name,
                    custom_feature.custom_feature_val,
                ]
            );
            custom_feature.custom_feature_id = result[0].insertId;
            connection.unprepare(insert_custom_feature_query);
        }
    }

    async saveOptions(connection) {
        for (const option of this.options) {
            const insert_option_query = `
                insert into variant_option (product_id, option_name)
                values (?, ?)
            `;

            const result = await connection.execute(insert_option_query, [
                this.product_id,
                option.option_name,
            ]);
            option.option_id = result[0].insertId;
            connection.unprepare(insert_option_query);

            for (const value of option.values) {
                const insert_value_query =
                    "insert into variant_option_values (product_id, option_id, value_name) values (?, ?, ?)";
                const result = await connection.execute(insert_value_query, [
                    this.product_id,
                    option.option_id,
                    value.value_name,
                ]);
                value.value_id = result[0].insertId;
                connection.unprepare(insert_value_query);
            }
        }
    }

    async update() {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();
            await this.updateProduct(connection);
            await this.updateCategory(connection);
            await connection.commit();
        } catch (e) {
            await connection.rollback();
            await connection.release();
            throw e;
        }

        await connection.release();
    }

    async updateProduct(connection) {
        const {
            product_title: old_title,
            sku: old_sku,
            product_weight: old_weight,
        } = Product.getProduct(this.product_id);

        if (
            this.product_title !== old_title ||
            this.sku !== old_sku ||
            this.product_weight !== old_weight
        ) {
            const update_product_query = `
                update
                    product
                set
                    product_title = ?,
                    sku = ?,
                    product_weight = ?
                where
                    product_id = ?
            `;

            await connection.execute(update_product_query, [
                this.product_title,
                this.sku,
                this.product_weight,
                this.product_id,
            ]);
            connection.unprepare(update_product_query);
        }
    }

    async updateCategory(connection) {
        const update_product_category_query = `
            update
                product_category
            set category_id = ?,
                sub_category_id = ?
            where
                product_id = ?
        `;

        await connection.execute(update_product_category_query, [
            this.category_id,
            this.sub_category_id,
            this.product_id,
        ]);
        connection.unprepare(update_product_category_query);
    }

    static async makeDefault(productId, variantId) {
        const make_default_query = `
            update
                product
            set
                default_variant_id = ?
            where product_id = ?
        `;

        await db.execute(make_default_query, [variantId, productId]);
    }

    static async saveProductImage(productId, imageName) {
        const save_image_query = `
            update
                product
            set
                image_name = ?
            where
                product_id = ?
        `;

        await db.execute(save_image_query, [imageName, productId]);
    }

    static async deleteCustomFeature(featureId) {
        const delete_custom_feature_query = `
            delete
                from custom_feature
                where custom_feature_id = ?
        `;

        await db.execute(delete_custom_feature_query, [featureId]);
    }

    static async deleteProduct(productId) {
        const delete_product_query = `
            update
                product
            set
                availability = 'UNAVAILABLE'
            where
                product_id = ?
        `;

        await db.execute(delete_product_query, [productId]);
    }

    static async restoreProduct(productId) {
        const restore_product_query = `
            update
                product
            set
                availability = 'AVAILABLE'
            where
                product_id = ?
        `;

        await db.execute(restore_product_query, [productId]);
    }

    static async checkProductVariant(productId, variantId) {
        const check_query = `
            select
                variant_id
            from
                variant
            where
                variant_id = ?
                and product_id = ?
        `;

        const [result, _] = await db.execute(check_query, [
            variantId,
            productId,
        ]);
        return result.length > 0;
    }

    static getSchema() {
        return Product.#schema;
    }
}

function validateProduct(product, props) {
    const schema = _.pick(Product.getSchema(), props);
    const object = _.pick(product, props);

    return Joi.object(schema).validate(object);
}

function validateCustomFeature(feature) {
    const schema = {
        custom_feature_name: Joi.string()
            .required()
            .min(3)
            .max(100)
            .label("Custom Feature Name"),
        custom_feature_val: Joi.string()
            .required()
            .min(3)
            .max(250)
            .label("Custom Feature Value"),
    };

    return Joi.object(schema).validate(
        _.pick(feature, "custom_feature_name", "custom_feature_val")
    );
}

function validateOption(option) {
    const schema = {
        option_name: Joi.string()
            .required()
            .min(3)
            .max(250)
            .label("Option Name"),
        values: Joi.array().items(Joi.object({ value_name: Joi.string() })),
    };

    return Joi.object(schema).validate(
        _.pick(option, ["option_name", "values"])
    );
}

module.exports.Product = Product;
module.exports.validateProduct = validateProduct;
module.exports.validateCustomFeature = validateCustomFeature;
module.exports.validateOption = validateOption;
