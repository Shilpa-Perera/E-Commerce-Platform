import http from "./httpService";
import _ from "lodash";

const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/orders";

export function getOrders() {
    try {
        return http.get(apiEndpoint);
    } catch (error) {
        return null;
    }
}
export function getCustomerOrders(customerId) {
    return http.get(apiUrl + "/customers/orders/" + customerId);
}

export function getOrder(id) {
    return http.get(apiEndpoint + "/" + id);
}

export function setOrderDetails(details) {
    return http.post(
        apiUrl + "/orders/checkout",
        _.pick(details, ["data", "cartId"])
    );
}

export function validateAndConfirmOrder(details) {
    return http.post(
        apiUrl + "/orders/checkout/payment",
        _.pick(details, [
            "data",
            "cartId",
            "paymentMethod",
            "totalPrice",
            "paymentDetails",
            "deliveryMethod",
            "customerId",
        ])
    );
}

export function updateOrderStatus(orderDetails){
    const result = http.put(`${apiEndpoint}/update`, _.pick(orderDetails, ["data", "orderId"]));
    console.log(result);
}
