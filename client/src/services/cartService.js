import http from "./httpService";
import _ from "lodash";

const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/cart/products";

function productUrl(id) {
    return `${apiEndpoint}/${id}`;
}

export function getCartProducts(cart_id){
    return http.get(productUrl(cart_id));
}