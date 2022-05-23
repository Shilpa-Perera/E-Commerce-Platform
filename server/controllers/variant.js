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
            if (variantIds.length === 0) break;
        }
        if (variantIds.length === 1) {
            const variant = await Variant.getVariant(variantIds[0]);
            return res.send(variant[0]);
        }
        return res
            .status(404)
            .send("The variant with the given parameters was not found");
    }

    static async postVariants(req, res, next) {
        const variant = new Variant({
            variant_id: null,
            ..._.pick(req.body, [
                "product_id",
                "variant_name",
                "price",
                "quantity",
                "options",
            ]),
        });
        await variant.save();

        res.send(variant);
    }
}

module.exports.VariantController = VariantController;
