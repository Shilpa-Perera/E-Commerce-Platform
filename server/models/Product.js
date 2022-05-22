const jwt = require("jsonwebtoken");
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
    }

    static fetchAll() {
        const select_all_query = "select * from product";
        return db.execute(select_all_query);
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
        const get_product_query = "select * from product where product_id=?";
        const [products, _] = await db.execute(get_product_query, [productId]);

        if (products.length > 0) {
            return products[0];
        }

        return false;
    }

    static async getCustomFeatures(productId) {
        const get_custom_features_query =
            "select custom_feature_name, custom_feature_val from custom_feature where product_id=?";
        const custom_features = await db.execute(get_custom_features_query, [
            productId,
        ]);
        return custom_features[0];
    }

    static async getOptionValues(productId, optionId) {
        const get_option_values_query =
            "select value_id, value_name from variant_option_values where product_id=? and option_id=?";
        const option_values = await db.execute(get_option_values_query, [
            productId,
            optionId,
        ]);
        return option_values[0];
    }

    static async getOptions(productId) {
        const get_options_query =
            "select option_id, option_name from variant_option where product_id=?";
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

    async save() {
        const connection = await db.getConnection();
        let success = true;

        try {
            await connection.beginTransaction();
            await this.saveProduct(connection);
            await this.saveCustomFeatures(connection);
            await this.saveOptions(connection);
            await connection.commit();
        } catch (e) {
            await connection.rollback();
            console.error(e);
            success = false;
        } finally {
            await connection.release();
        }

        return success;
    }

    async saveProduct(connection) {
        const insert_product_query =
            "insert into product (product_title, sku, product_weight) values (?, ?, ?)";
        const result = await connection.execute(insert_product_query, [
            this.product_title,
            this.sku,
            this.product_weight,
        ]);
        this.product_id = result[0].insertId;
        connection.unprepare(insert_product_query);
    }

    async saveCustomFeatures(connection) {
        for (const custom_feature of this.custom_features) {
            const insert_custom_feature_query =
                "insert into custom_feature (product_id, custom_feature_name, custom_feature_val) values (?, ?, ?)";
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
            const insert_option_query =
                "insert into variant_option (product_id, option_name) values (?, ?)";
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
}

module.exports.Product = Product;
// module.exports.validate = validateUser;
