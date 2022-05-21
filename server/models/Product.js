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
        this.variants = productDetails.variants;
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

    static fetchAll() {
        const select_all_query = "select * from product";
        return db.execute(select_all_query);
    }

    static async getProductById(productId) {
        const get_product_query = "select * from product where product_id=?";
        const [products, _] = await db.execute(get_product_query, [productId]);

        if (products.length > 0) {
            return products[0];
        }

        return false;
    }
}

module.exports.Product = Product;
// module.exports.validate = validateUser;
