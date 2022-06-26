const _ = require("lodash");
const { Order } = require("../models/Order");

class OrderController {
    static async getAllOrders(req, res, next) {
        const allOrders = await Order.fetchAll();
        res.send(allOrders[0]);
    }

    static async getOrderCart(req, res, next) {
        const { id } = req.params;
        const orderCart = await Order.getOrderCart(id);
        const orderDetails = await Order.getOrderById(id);
        const orderArray = {
            orderDetails: orderDetails,
            orderCart: orderCart[0],
        };
        console.log("api - order id: ", id);
        res.send(orderArray);
    }

    static async setOrderDetails(req, res, next) {
        const test = req.body;
        const validation = OrderController.validateData(test);
        let validateResult = validation[0];
        let error = validation[1];
        let estimatedDeliveryTime = 6;
        if (validateResult) {
            console.log("valid" , error);
            
            return res.status(200).send([test, error, estimatedDeliveryTime]);
        }

        return res.status(200).send([test,error]);
    }

    static validateData(data) {
        const dataArray = data.data;
        for (const [key, value] of Object.entries(dataArray)) {
            if (value === "") {
                return [false, "Empty Field"];
            }
        }
        const validateEmail = (email) => {
            return email.match(
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
        };
        if (!validateEmail(dataArray.email)) {
            return [false, "Invalid Email"];
        }

        if (!/^\d{5}(-\d{4})?$/.test(dataArray.zipcode)) {
            return [false, "Invalid ZIP code"];
        }


        return [true, "All set"];
    }
}

module.exports.OrderController = OrderController;
