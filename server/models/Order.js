const db = require('../util/database');
const dotenv = require('dotenv');
dotenv.config();

class Order {
    constructor(orderDetails) {
        this.order_id = orderDetails.order_id;
        this.customer_id = orderDetails.customer_id;
        this.cart_id = orderDetails.cart_id;
        this.date = orderDetails.date;
        this.order_name = orderDetails.order_name;
        this.delivery_address = orderDetails.delivery_address;
        this.phone_number = orderDetails.phone_number;
        this.delivery_method = orderDetails.delivery_method;
        this.payment = orderDetails.payment;

    }

    static fetchAll() {
        const select_all_query = "SELECT * FROM `order` ORDER BY date ASC;";
        return db.execute(select_all_query);
    }

    static async getOrderById(orderId) {
        const product_values_query = "SELECT * FROM `order` WHERE order_id = ?";
        const result = await db.execute(product_values_query, [orderId]);
        return result[0];
    }

    static async updateOrderStatus(orderStatus, orderId) {
        const update_status_query = "UPDATE sell SET delivery_state = ? WHERE order_id = ?";
        const result = await db.execute(update_status_query, [orderStatus, orderId]);
        return result;
    }

    static async getMostPurchasedCatergory() {
        const mostOrderedCatergory = "";
        const result = await db.execute(mostOrderedCatergory);
        return result[0];
    }

    static async getOrderCart(orderId) {
        const getOrderCart = "SELECT variant_name, variant_id, product_id, number_of_items  FROM `order` JOIN (SELECT cart.cart_id, variant.variant_name, variant.variant_id, variant.product_id, number_of_items FROM `cart_product` JOIN cart ON cart_product.cart_id = cart.cart_id JOIN variant ON variant.variant_id = cart_product.variant_id) AS X ON X.cart_id = `order`.cart_id WHERE order_id = ?;";
        const result = await db.execute(getOrderCart, [orderId]);
        return result;
    }

}

module.exports.Order = Order;