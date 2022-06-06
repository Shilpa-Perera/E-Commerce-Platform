const _ = require("lodash");
const { Order } = require("../models/Order");

class OrderController {
    static async getAllOrders(req, res, next) {
        const allOrders = await Order.fechAll();
        res.send(allOrders[0]);
    }

   
}

module.exports.ProductController = ProductController;
