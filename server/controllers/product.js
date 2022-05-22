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
            ])
        );
        await product.save();

        res.send(product);
    }
}

module.exports.ProductController = ProductController;
