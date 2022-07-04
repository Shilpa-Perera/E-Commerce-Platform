const _ = require("lodash");
const jwt = require("jsonwebtoken");
const { Variant, validateVariant } = require("../models/Variant");
const config = require("config");
const ROLE = require("../util/roles.json");
const { CustomerAddress } = require("../models/Customer");
const { Delivery } = require("../util/delivery");

class VariantController {
    static async getVariant(req, res, next) {
        const { body } = req.query;
        const { product_id, options } = JSON.parse(body);

        const token = req.header("x-auth-token");
        let user = null;
        try {
            user = token
                ? jwt.verify(token, config.get("jwtPrivateKey"))
                : null;
        } catch (e) {}

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
            const variantId = variantIds[0];
            const variant = await Variant.getVariant(variantId);

            const allImages = await Variant.fetchAllImages(variantId);
            variant.images = allImages[0];

            if (user && user.role === ROLE.CUSTOMER) {
                const addresses = await CustomerAddress.getAddressesById(
                    user.user_id
                );
                for (const address of addresses) {
                    address.estimated_delivery =
                        await Delivery.calcVariantDeliveryEstimation(
                            address.postal_code,
                            variant.quantity
                        );
                }

                variant.addresses = addresses;
            }

            return res.send(variant);
        }
        return res.send({ variant_id: 0 });
    }

    static async getVariantById(req, res, next) {
        const variantId = req.params.id;
        const variant = await Variant.getVariant(variantId);

        if (!variant)
            return res
                .status(404)
                .send("The variant with the given ID was not found");

        const allImages = await Variant.fetchAllImages(variantId);
        variant.images = allImages[0];

        return res.send(variant);
    }

    static async postVariant(req, res, next) {
        const props = [
            "product_id",
            "variant_name",
            "price",
            "quantity",
            "options",
        ];

        const variant = new Variant({
            variant_id: null,
            ..._.pick(req.body, props),
        });

        const { error } = validateVariant(variant, props);
        if (error) return res.status(400).send(error.details[0].message);

        await variant.save();

        res.send(variant);
    }

    static async putVariant(req, res, next) {
        const props = ["variant_name", "price", "quantity"];

        const variant = new Variant({
            variant_id: req.params.id,
            ..._.pick(req.body, props),
            product_id: null,
            options: null,
        });

        props.push("variant_id");
        const { error } = validateVariant(variant, props);
        if (error) return res.status(400).send(error.details[0].message);

        await variant.update();

        res.send(_.pick(variant, props));
    }

    static async postImage(req, res, body) {
        const variantId = req.params.id;
        const { filename } = req.file;
        await Variant.saveVariantImage(variantId, filename);

        res.send({ filename });
    }

    static async getImages(req, res, next) {
        const variantId = req.params.id;
        const allImages = await Variant.fetchAllImages(variantId);

        res.send(allImages[0]);
    }
}

module.exports.VariantController = VariantController;
