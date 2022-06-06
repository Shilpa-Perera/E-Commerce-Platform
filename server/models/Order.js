const db = require('../util/database');
const dotenv = require('dotenv');
dotenv.config();

class Order{
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
        const select_all_query = 'select * from order;'
        return db.execute(select_all_query);
    }

    static async getOrderById(orderId){
        const product_values_query = "select * from order where order_id = ?";
        const result = await db.execute(product_values_query, [orderId]); 
        return result[0];
    }
    
}

module.exports.Cart = Cart;