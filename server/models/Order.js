const db = require("../util/database");
const dotenv = require("dotenv");
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
        const select_all_query =
            "SELECT * FROM `order` NATURAL JOIN sell ORDER BY date ASC;";
        const result = db.execute(select_all_query, []);
        return result;
    }

    static async getOrderById(orderId) {
        const product_values_query =
            "SELECT * FROM `order` NATURAL JOIN sell WHERE `order`.order_id = ?;";
        const result = await db.execute(product_values_query, [orderId]);
        return result[0];
    }

    static async getCustomerOrders(customerId) {
        const customer_order_query =
            "SELECT * FROM `order` NATURAL JOIN sell WHERE customer_id = ?";
        const result = await db.execute(customer_order_query, [customerId]);
        return result;
    }

    static async updateOrderStatus(data) {
        const update_status_query =
            "UPDATE `sell` SET `delivery_state`=?, `payment_state`=? WHERE `order_id`=?";
        result = await db.execute(update_status_query, [
            data.deliveryStatus,
            data.paymentStatus,
            data.orderId,
        ]);
        return result;
    }

    static async updateOrderStatuswithTime(data, paymentTime) {
        const update_status_query =
            "UPDATE `sell` SET `delivery_state` = ?, `payment_state` = ?, `date_time` = ? WHERE `order_id` = ?";
        const result = await db.execute(update_status_query, [
            data.deliveryStatus,
            data.paymentStatus,
            paymentTime,
            data.orderId,
        ]);
        return result;
    }

    static async getMostPurchasedCatergory() {
        const mostOrderedCatergory = "";
        const result = await db.execute(mostOrderedCatergory);
        return result[0];
    }

    static async getOrderCart(orderId) {
        const getOrderCart =
            "SELECT variant_name, variant_id, product_id, number_of_items, product_title, price  FROM `order` JOIN (SELECT cart.cart_id, variant.variant_name, variant.variant_id, variant.product_id, number_of_items, price FROM `cart_product` JOIN cart ON cart_product.cart_id = cart.cart_id JOIN variant ON variant.variant_id = cart_product.variant_id) AS X ON X.cart_id = `order`.cart_id natural JOIN product WHERE order_id = ?;";
        const result = await db.execute(getOrderCart, [orderId]);
        return result;
    }

    static async insertNewOrder(details) {
        let insertOrder = null;
        let outputOrderId = "NewOrderID";

        if (details.customerId === null) {
            insertOrder =
                "CALL order_transaction_guest(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?); ";
        } else {
            insertOrder =
                "CALL order_transaction(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?); ";
        }

        const result = await db.execute(insertOrder, [
            details.cartId,
            details.orderDateTime,
            details.orderName,
            details.orderDeliveryAddress,
            details.zipCode,
            details.orderTelephone,
            details.deliveryMethod,
            details.paymentMethod,
            details.customerId,
            details.sellDateTime,
            details.sellPaymentStatus,
            outputOrderId,
        ]);
        return result;
    }
}

module.exports.Order = Order;
