const _ = require("lodash");
const { Order } = require("../models/Order");

class OrderController {
    static async getAllOrders(req, res, next) {
        const allOrders = await Order.fetchAll();
        console.log("api called orders sent...");
        res.send(allOrders[0]);
    }
}

module.exports.OrderController = OrderController;
