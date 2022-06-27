const bcrypt = require("bcrypt");
const { Cart } = require("../models/Cart");

class CartController {
	static async getAllCarts(req, res, next) {
		const allCarts = await Cart.fetchAll();
		res.send(allCarts[0]);
	}

	static async getCartByID(req, res, next) {
		const cart = await Cart.getCartByID(req.params.id);
		res.send(cart);
	}

	static async getCartProducts(req, res, next) {
		const products = await Cart.getCartProducts(req.params.id);
		res.send(products);
	}

	static async addProductToCart(req, res, next) {
		const cart_id = req.body.cart_id;
		const variant_id = req.body.variant_id;
		const isExist = await Cart.addProductToCart(cart_id, variant_id);
		res.send(isExist);
	}

	static async updateItemCount(req, res, next) {
		const cart_id = req.body.cart_id;
		const variant_id = req.body.variant_id;
		const number_of_items = req.body.number_of_items;
		await Cart.updateItemCount(cart_id, variant_id, number_of_items);
		res.status(201).send("Success");
	}

	static async getNewGuestCart(req, res, next) {
		const cart_id = await Cart.getNewGuestCart();
		res.send(cart_id);
	}

	static async deleteProduct(req, res, next) {
		const cart_id = req.params.cart_id;
		const variant_id = req.params.variant_id;
		await Cart.deleteProduct(cart_id, variant_id);
		res.status(201).send("Success");
	}
}

module.exports.CartController = CartController;
