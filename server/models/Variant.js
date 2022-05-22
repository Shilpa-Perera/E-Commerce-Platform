const jwt = require("jsonwebtoken");
const Joi = require("joi");
const db = require("../util/database");
const dotenv = require("dotenv");
dotenv.config();

class Variant {
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
}

module.exports.Variant = Variant;
