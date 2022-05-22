const bcrypt = require("bcrypt");
const _ = require("lodash");
const { Variant } = require("../models/Variant");

class VariantController {
    static async getVariant(req, res, next) {
        const { product_id, options } = req.body;
        let variantIds = false;
        let variantIdResults = [];
        for (const { option_id, value_id } of options) {
            variantIdResults = await Variant.getVariantIds(
                product_id,
                option_id,
                value_id,
                variantIds
            );
            variantIdResults = variantIdResults[0];
            variantIds = [];
            for (const variant of variantIdResults) {
                variantIds.push(variant.variant_id);
            }
        }
        if (variantIds.length === 1) {
            const variant = await Variant.getVariant(variantIds[0]);
            return res.send(variant[0]);
        }
        return res
            .status(404)
            .send("The variant with the given parameters was not found");
    }
}

module.exports.VariantController = VariantController;
