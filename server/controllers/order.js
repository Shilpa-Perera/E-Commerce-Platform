const _ = require("lodash");
const { Order } = require("../models/Order");

class OrderController {
    static async getAllOrders(req, res, next) {
        const allOrders = await Order.fetchAll();
        res.send(allOrders[0]);
    }

    static async getCustomerOrders(req, res) {
        const { id: customerId } = req.params;
        const allCustomerOrders = await Order.getCustomerOrders(customerId);
        return res.status(200).send(allCustomerOrders[0]);
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
        let estimatedDeliveryTime = 6; // ## fix calculation
        if (validateResult) {
            console.log("valid", error);

            return res.status(200).send([test, error, estimatedDeliveryTime]);
        }

        return res.status(200).send([test, error]);
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

    static async confirmAndSetOrder(req, res, next) {
        const orderDetails = req.body;
        let error = null;
        let sellDateTime = null;
        let paymentStatus = "PENDING";
        // console.log(orderDetails);
        const orderDateTime = new Date()
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
        // console.log(orderDateTime);

        // Payment Call

        let paymentResult = true; // ### to payment Gateway

        if (!paymentResult) {
            error = "Payment Failed";
            return res.status(200).send([orderDetails, error]);
        } else if (orderDetails.paymentMethod === "CARD") {
            sellDateTime = orderDateTime;
            paymentStatus = "PAID";
        }

        const finalDataFormat = {
            cartId: orderDetails.cartId,
            orderDateTime: orderDateTime,
            orderName:
                orderDetails.data.firstName + " " + orderDetails.data.lastName,
            orderDeliveryAddress: orderDetails.data.deliveryAddress,
            zipCode: orderDetails.data.zipcode,
            orderTelephone: orderDetails.data.telephone,
            deliveryMethod: orderDetails.deliveryMethod,
            paymentMethod: orderDetails.paymentMethod,
            customerId: orderDetails.customerId,
            sellDateTime: sellDateTime,
            sellPaymentStatus: paymentStatus,
        };
        try {
            error = await Order.insertNewOrder(finalDataFormat);
        } catch (e) {
            error = "Payment Failed";
        }

        let newOrderId = error[0].at(-2)[0].orderIdOutput;
        return res.status(200).send([orderDetails, newOrderId]);
    }
}

module.exports.OrderController = OrderController;
