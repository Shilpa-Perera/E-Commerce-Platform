import http from "./httpService";
import _ from "lodash";

const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/cart";

function productUrl(id) {
    return `${apiEndpoint}/products/${id}`;
}

export function getCartProducts(cart_id){
    return http.get(productUrl(cart_id));
}

export function updateItemCount(cart_id,variant_id,number_of_items){
    return http.put(apiEndpoint , {
        "cart_id" : cart_id ,
        "variant_id" : variant_id ,
        "number_of_items" : number_of_items 
    }
        
    );
}