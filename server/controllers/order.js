const _ = require("lodash");
const { Order } = require("../models/Order");

class OrderController {
    static async getAllOrders(req, res, next) {
        const allOrders = await Order.fetchAll();
        console.log("api called orders sent...");
        res.send(allOrders[0]);
    }

    static async getOrderCart(req, res, next){
        const {id} = req.params;
        const orderCart = await Order.getOrderCart(id);
        res.send(orderCart[0]);
    }
}

module.exports.OrderController = OrderController;
