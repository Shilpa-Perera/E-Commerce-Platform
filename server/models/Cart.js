const db = require("../util/database");
const dotenv = require("dotenv");
dotenv.config();

class Cart {
	constructor(cartDetails) {
		/* Single Cart */
		this.cart_id = cartDetails.cart_id;
		this.customer_id = cartDetails.customer_id;
		this.state = cartDetails.state;
	}

	static fetchAll() {
		return db.execute("select * from cart;");
	}

	// static async getCartByID(cart_id) {
	// 	let stmt = `select * from cart where cart_id=? ;`;
	// 	const [cart, _] = await db.execute(stmt, [cart_id]);
	// 	if (cart.length > 0) {
	// 		return cart[0];
	// 	}
	// 	return false;
	// }

	static async getCartByCustomerID(cusomter_id) {
		let stmt = `select cart_id from cart where customer_id=? and state=?`;
		const [cart_id, _] = await db.execute(stmt, [cusomter_id, "ACTIVE"]);
		return cart_id[0];
	}

	static async getNewGuestCart() {
		const newCartQuery =
			"insert into cart (customer_id , state) values (null , ?) ; ";
		const result = await db.execute(newCartQuery, ["ACTIVE"]);
		const cart = { cart_id: result[0].insertId };
		return cart;
	}

	static async getCartProducts(id) {
		let stmt = `select cp.cart_id , 
						   cp.variant_id , 
						   v.variant_name , 
						   cp.number_of_items , 
						   v.price , 
						   p.product_title , 
						   p.product_id , 
						   p.image_name 
						   from 
                    cart_product cp natural join 
					variant v inner join product 
					p using (product_id) 
					where cart_id=? and 
					cp.number_of_items > 0;`;
		const [products, _] = await db.execute(stmt, [id]);
		if (products.length > 0) {
			return products;
		}
		return false;
	}

	static async updateItemCount(cart_id, variant_id, number_of_items) {
		let stmt = `update cart_product set number_of_items = ? where cart_id = ? and variant_id = ? `;
		await db.execute(stmt, [number_of_items, cart_id, variant_id]);
	}

	static async setCustomerId(cart_id, customer_id) {
		let stmt = `update cart set customer_id = ? where cart_id = ?`;
		await db.execute(stmt, [customer_id, cart_id]);
	}

	static async deleteProduct(cart_id, variant_id) {
		let stmt = `delete from cart_product where cart_id = ? and variant_id = ? ;`;
		await db.execute(stmt, [cart_id, variant_id]);
	}

	static async addProductToCart(cart_id, variant_id) {
		const isExist = await this.checkCartItem(cart_id, variant_id);
		if (!isExist.exist) {
			let stmt = `insert into cart_product values(? , ? , ?) ;`;
			await db.execute(stmt, [cart_id, variant_id, 1]);
		}
		return isExist;
	}

	static async checkCartItem(cart_id, variant_id) {
		let stmt = `select exists(select * from cart_product where cart_id = ? and variant_id = ?) as exist ;`;
		const [data, _] = await db.execute(stmt, [cart_id, variant_id]);
		return data[0];
	}

	static async inactiveCart(cart_id) {
		let stmt = `update cart set state = ? where cart_id = ? ; `;
		await db.execute(stmt, ["INACTIVE", cart_id]);
	}
}

module.exports.Cart = Cart;
