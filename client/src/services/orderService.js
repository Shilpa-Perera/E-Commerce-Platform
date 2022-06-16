import http from "./httpService";
import _ from "lodash";

const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/orders";

export function getOrders() {
    return http.get(apiEndpoint);
}