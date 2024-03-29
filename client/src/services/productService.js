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

export function getUnavailableProducts() {
    return http.get(`${apiEndpoint}/unavailable`);
}

export function saveProduct(product) {
    if (product.product_id > 0) {
        const body = { ...product };
        delete body.product_id;
        return http.put(
            productUrl(product.product_id),
            _.pick(body, ["product_title", "sku", "product_weight"])
        );
    } else {
        return http.post(
            apiEndpoint,
            _.pick(product, [
                "product_title",
                "sku",
                "product_weight",
                "custom_features",
                "product_categories",
                "options",
            ])
        );
    }
}

export function restoreProduct(productId) {
    return http.post(`${apiEndpoint}/restore/${productId}`);
}

export function checkProductVariant(productId, variantId) {
    return http.post(`${apiEndpoint}/check`, {
        product_id: productId,
        variant_id: variantId,
    });
}

export function updateDefault(productId, variantId) {
    return http.put(`${apiEndpoint}/default/${productId}`, {
        variant_id: variantId,
    });
}

export function putProductImage(productId, image) {
    const formData = new FormData();

    formData.append("product_img", image, "product_img.png");

    return http.put(`${apiEndpoint}/image/${productId}`, formData);
}

export function deleteProduct(productId) {
    return http.delete(productUrl(productId));
}
