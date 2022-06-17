import http from "./httpService";
import _ from "lodash";

const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/cart";

function productUrl(id) {
    return `${apiEndpoint}/products/${id}`;
}

function newCartUrl(){
    return `${apiEndpoint}/new`;
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
export async function setCartId(){

    const local_id = localStorage.getItem("cart_id");
        
    if(!local_id){
        const { data : cart_id } = await getCartId();
        localStorage.setItem("cart_id", cart_id.cart_id);
        localStorage.setItem("item_count", 0) ;
    }

}

export function getCartId(){
 
    return http.get(newCartUrl()) ;

}

export function addProductToCart(obj){
    return http.post(apiEndpoint,obj);
}