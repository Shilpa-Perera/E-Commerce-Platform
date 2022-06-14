const _ = require("lodash");
const { Product } = require("../models/Product");

class ProductController {
    static async getAllProducts(req, res, next) {
        const allProducts = await Product.fetchAll();
        res.send(allProducts[0]);
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
        let product = new Product(
            _.pick(req.body, [
                "product_title",
                "sku",
                "product_weight",
                "custom_features",
                "options",
                "category_id",
                "sub_category_id",
            ])
        );
        await product.save();

        res.send(product);
    }

    static async postCustomFeature(req, res, next) {
        const { product_id, custom_feature } = req.body;
        await Product.addCustomFeature(product_id, custom_feature);

        res.send(custom_feature);
    }

    static async putCustomFeature(req, res, next) {
        const customFeature = _.pick(req.body, [
            "custom_feature_name",
            "custom_feature_val",
        ]);
        customFeature.custom_feature_id = req.params.id;
        await Product.updateCustomFeature(customFeature);

        res.send(customFeature);
    }

    static async putProduct(req, res, next) {
        const product = new Product({
            product_id: req.params.id,
            ..._.pick(req.body, [
                "product_title",
                "sku",
                "product_weight",
                "category_id",
                "sub_category_id",
            ]),
            custom_features: null,
            options: null,
        });
        await product.update();

        res.send(product);
    }

    static async putDefault(req, res, next) {
        const productId = req.params.id;
        const variantId = req.body.variant_id;
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

    static async deleteProduct(req, res, next) {
        const productId = req.params.id;
        await Product.deleteProduct(productId);
    }
}

module.exports.ProductController = ProductController;
