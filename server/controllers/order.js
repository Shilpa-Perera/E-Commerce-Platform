const _ = require("lodash");
const { Order } = require("../models/Order");
const { DateTime } = require("../util/dateTime");
const { Delivery } = require("../util/delivery");
const { EmailController } = require("./email");

class OrderController {
    static async getAllOrders(req, res) {
        const allOrders = await Order.fetchAll();

        allOrders[0].map(
            (e) => (e.date = DateTime.convertToLocalDateTime(e.date))
        );

        return res.send(allOrders[0]);
    }

    static async getYearPeriodOfSold(req, res) {
        const period = await Order.getYearPeriodOfSold();

        return res.send(period);
    }

    static async getCustomerOrders(req, res) {
        const { id: customerId } = req.params;
        const allCustomerOrders = await Order.getCustomerOrders(customerId);
        allCustomerOrders[0].map(
            (e) => (e.date = DateTime.convertToLocalDateTime(e.date))
        );

        return res.status(200).send(allCustomerOrders[0]);
    }

    static async getOrderCart(req, res) {
        const { id } = req.params;
        const orderCart = await Order.getOrderCart(id);
        const orderDetails = await Order.getOrderById(id);

        orderDetails[0].date = DateTime.convertToLocalDateTime(
            orderDetails[0].date
        );
        orderDetails[0].date_time = DateTime.convertToLocalDateTime(
            orderDetails[0].date_time
        );

        const orderArray = {
            orderDetails: orderDetails,
            orderCart: orderCart[0],
        };
        res.send(orderArray);
    }

    static async setOrderDetails(req, res) {
        const orderData = req.body;
        const validation = OrderController.validateData(orderData);
        let validateResult = validation[0];
        let error = validation[1];
        let estimatedDeliveryTime = await Delivery.calcDeliveryEstimation(
            orderData.data.zipcode,
            orderData.cartId
        ); // Estimated Delivery days calculation
        if (validateResult) {
            console.log("valid", error);

            return res
                .status(200)
                .send([orderData, error, estimatedDeliveryTime]);
        }
        return res.status(200).send([orderData, error]);
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

        if (
            !/^\+?\d{0,3}\s?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/.test(
                dataArray.telephone
            )
        ) {
            return [false, "Invalid Telephone"];
        }

        return [true, "All set"];
    }

    static async confirmAndSetOrder(req, res) {
        const orderDetails = req.body;
        let error = null;
        let sellDateTime = null;
        let paymentStatus = "PENDING";
        const orderDateTime = DateTime.getDBreadyCurrentDateTime();

        if (orderDetails.paymentMethod === "CARD") {
            // Payment Call
            let paymentResult = true; // ### to payment Gateway

            if (!paymentResult) {
                error = "Payment Failed";
                return res.status(200).send([orderDetails, error]);
            } else {
                sellDateTime = orderDateTime;
                paymentStatus = "PAID";
            }
        }

        const finalDataFormat = {
            cartId: orderDetails.cartId,
            orderDateTime: orderDateTime,
            orderName:
                orderDetails.data.firstName + " " + orderDetails.data.lastName,
            orderDeliveryAddress:
                orderDetails.data.deliveryAddress +
                ", " +
                orderDetails.data.city,
            zipCode: orderDetails.data.zipcode,
            orderTelephone: orderDetails.data.telephone,
            customerEmail: orderDetails.data.email,
            deliveryMethod: orderDetails.deliveryMethod,
            paymentMethod: orderDetails.paymentMethod,
            customerId: orderDetails.customerId,
            sellDateTime: sellDateTime,
            sellPaymentStatus: paymentStatus,
        };
        try {
            error = await Order.insertNewOrder(finalDataFormat);
        } catch (e) {
            error = "Order Failed";
            return res.status(200).send([orderDetails, error]);
        }

        let newOrderId = error[0].at(-2)[0].orderIdOutput;
        EmailController.emailOrderConfirmation(
            finalDataFormat,
            newOrderId,
            orderDetails.data.email
        );

        return res.status(200).send([orderDetails, newOrderId]);
    }

    static async updateOrderStatus(req, res) {
        let error = "Updated Successfully!";
        let time = null; // Date Time of updated Payment
        const data = {
            deliveryStatus: req.body.data.delivery_state,
            paymentStatus: req.body.data.payment_status,
            orderId: req.body.orderId,
        };
        req.body.initialPaymentState === "PENDING" &&
        data.paymentStatus === "PAID"
            ? (time = await DateTime.getDBreadyCurrentDateTime())
            : (time = null);

        req.body.initialPaymentState === data.paymentStatus
            ? (time = false)
            : (time = time);
        try {
            time === false
                ? await Order.updateOrderStatus(data)
                : await Order.updateOrderStatuswithTime(data, time);
        } catch (error) {
            error = "Error Try Again !";
        }
        req.body.initialDeliveryState === data.deliveryStatus
            ? (error = error)
            : EmailController.emailOrderUpdate(data);
        return res.status(200).send([error]);
    }
}

module.exports.OrderController = OrderController;
