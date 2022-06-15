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
        const select_all_query = "SELECT * FROM `order` ORDER BY date ASC;";
        return db.execute(select_all_query);
    }

    static async getOrderById(orderId){
        const product_values_query = "SELECT * FROM `order` WHERE order_id = ?";
        const result = await db.execute(product_values_query, [orderId]); 
        return result[0];
    }

    static async updateOrderStatus(orderStatus, orderId){
        const update_status_query = "UPDATE sell SET delivery_state = ? WHERE order_id = ?";
        const result = await db.execute(update_status_query, [orderStatus, orderId]);
        return result;
    }

    static async getMostPurchasedCatergory(){
        const mostOrderedCatergory = "";
        const result = await db.execute(mostOrderedCatergory);
        return result[0];
    }
    
}

module.exports.Order = Order;