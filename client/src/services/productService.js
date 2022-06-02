import http from "./httpService";
import _ from "lodash";

const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/products";

function productUrl(id) {
    return `${apiEndpoint}/${id}`;
}

export function getProducts() {
    return http.get(apiEndpoint);
}

export function getProduct(productId) {
    return http.get(productUrl(productId));
}

export function saveProduct(product) {
    if (product.product_id > 0) {
        const body = { ...product };
        delete body.product_id;
        return http.put(
            productUrl(product.product_id),
            _.pick(body, [
                "product_title",
                "sku",
                "product_weight",
                "category_id",
                "sub_category_id",
            ])
        );
    } else {
        return http.post(
            apiEndpoint,
            _.pick(product, [
                "product_title",
                "sku",
                "product_weight",
                "custom_features",
                "options",
                "category_id",
                "sub_category_id",
            ])
        );
    }
}

export function updateDefault(productId, variantId) {
    return http.put(`${apiEndpoint}/default/${productId}`, {
        variant_id: variantId,
    });
}
