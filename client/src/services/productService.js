import http from "./httpService";

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
        return http.put(productUrl(product.product_id), body);
    } else {
        return http.post(apiEndpoint, product);
    }
}

export function updateDefault(productId, variantId) {
    return http.put(`${apiEndpoint}/default/${productId}`, {
        variant_id: variantId,
    });
}
