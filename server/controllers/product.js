const _ = require("lodash");
const Joi = require("joi");
const {
    Product,
    validateProduct,
    validateCustomFeature,
    validateOption,
    validateProductCategory,
    validateProductId,
} = require("../models/Product");
const { Variant } = require("../models/Variant");

class ProductController {
    static async getAllProducts(req, res, next) {
        const [allProducts, _] = await Product.fetchAll();

        for (const product of allProducts) {
            product.product_categories = await Product.getProductCategories(
                product.product_id
            );
        }

        res.send(allProducts);
    }

    static async getUnavailableProducts(req, res, next) {
        const [unavailableProducts, _] = await Product.fetchUnavailable();
        res.send(unavailableProducts);
    }

    static async getProduct(req, res, next) {
        const { id: productId } = req.params;
        const product = await Product.getProductById(productId);

        if (!product)
            return res
                .status(404)
                .send("The product with the given ID was not found");

        res.send(product);
    }

    static async postProduct(req, res, next) {
        const props = ["product_title", "sku", "product_weight"];

        const { error } = validateProduct(req.body, props);
        if (error) return res.status(400).send(error.details[0].message);

        props.push("custom_features");
        props.push("product_categories");
        props.push("options");
        let product = new Product(_.pick(req.body, props));

        const { custom_features, product_categories, options } = product;

        for (const custom_feature of custom_features) {
            const { error: error_cf } = validateCustomFeature(custom_feature);
            if (error_cf)
                return res.status(400).send(error_cf.details[0].message);
        }

        for (const productCategory of product_categories) {
            const { error: error_pc } =
                validateProductCategory(productCategory);
            if (error_pc)
                return res.status(400).send(error_pc.details[0].message);
        }

        for (const option of options) {
            const { error: error_o } = validateOption(option);
            if (error_o)
                return res.status(400).send(error_o.details[0].message);
        }

        await product.save();

        res.send(product);
    }

    static async postCustomFeature(req, res, next) {
        const { product_id, custom_feature } = req.body;

        let { error } = validateCustomFeature(custom_feature);
        if (error) return res.status(400).send(error.details[0].message);

        error = validateProductId(product_id);
        if (error) return res.status(400).send(error.details[0].message);

        await Product.addCustomFeature(product_id, custom_feature);

        res.send(custom_feature);
    }

    static async postProductCategory(req, res, next) {
        const { product_id, product_category } = req.body;

        let { error } = validateProductCategory(product_category);
        if (error) return res.status(400).send(error.details[0].message);

        error = validateProductId(product_id);
        if (error) return res.status(400).send(error.details[0].message);

        await Product.addProductCategory(product_id, product_category);

        res.send({ success: true });
    }

    static async putCustomFeature(req, res, next) {
        const customFeature = _.pick(req.body, [
            "custom_feature_name",
            "custom_feature_val",
        ]);

        const { error } = validateCustomFeature(customFeature);
        if (error) return res.status(400).send(error.details[0].message);

        const { error: error_id } = Joi.object({
            id: Joi.number().required().min(1).label("Custom Feature ID"),
        }).validate({ id: req.params.id });
        if (error_id) return res.status(400).send(error_id.details[0].message);

        customFeature.custom_feature_id = req.params.id;
        await Product.updateCustomFeature(customFeature);

        res.send(customFeature);
    }

    static async putProduct(req, res, next) {
        const props = ["product_title", "sku", "product_weight"];

        const product = new Product({
            product_id: req.params.id,
            ..._.pick(req.body, props),
            custom_features: null,
            product_categories: null,
            options: null,
        });

        props.push("product_id");
        const { error } = validateProduct(product, props);
        if (error) return res.status(400).send(error.details[0].message);

        await product.update();

        res.send(product);
    }

    static async putDefault(req, res, next) {
        const productId = req.params.id;
        const variantId = req.body.variant_id;

        const variantCheck = Variant.checkVariantOfProduct(
            productId,
            variantId
        );
        if (!variantCheck)
            return res
                .status(400)
                .send(
                    "The selected variant does dot exist for the given product."
                );

        await Product.makeDefault(productId, variantId);

        res.send({ variant_id: variantId });
    }

    static async putImage(req, res, next) {
        const productId = req.params.id;
        const { filename } = req.file;
        await Product.saveProductImage(productId, filename);

        res.send({ filename });
    }

    static async deleteFeature(req, res, next) {
        const featureId = req.params.id;
        await Product.deleteCustomFeature(featureId);
    }

    static async deleteProductCategory(req, res, next) {
        const { product_id, category_id, sub_category_id } = req.params;
        await Product.deleteProductCategory(
            product_id,
            category_id,
            sub_category_id
        );
    }

    static async deleteProduct(req, res, next) {
        const productId = req.params.id;
        await Product.deleteProduct(productId);
    }

    static async restoreProduct(req, res, next) {
        const productId = req.params.id;
        await Product.restoreProduct(productId);

        res.send({ success: true });
    }

    static async checkProductVariant(req, res, next) {
        const { product_id, variant_id } = req.body;
        const success = await Product.checkProductVariant(
            product_id,
            variant_id
        );

        res.send({ success });
    }
}

module.exports.ProductController = ProductController;
