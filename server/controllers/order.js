const _ = require("lodash");
const { Order } = require("../models/Order");

class OrderController {
    static async getAllOrders(req, res, next) {
        const allOrders = await Order.fetchAll();
        res.send(allOrders[0]);
    }

    static async getOrderCart(req, res, next){
        const {id} = req.params;
        const orderCart = await Order.getOrderCart(id);
        const orderDetails = await Order.getOrderById(id);
        const orderArray = {orderDetails: orderDetails, orderCart: orderCart[0]};
        console.log("api - order id: ", id);
        res.send(orderArray);
    }
}

module.exports.OrderController = OrderController;
