import http from "./httpService";
import _ from "lodash";

const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/orders";

export function getOrders() {
    return http.get(apiEndpoint);
}

export function getOrder(id) {
    return http.get(apiEndpoint + "/" + id);
}

export function setOrderDetails(details) {
    return http.post(apiUrl + "/orders/checkout", _.pick(details, ['data', 'cartId']));
}
