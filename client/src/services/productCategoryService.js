import http from "./httpService";

const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/products/product-categories";

export function saveProductCategory(productCategory, productId) {
    return http.post(apiEndpoint, {
        product_id: productId,
        product_category: productCategory,
    });
}

export function deleteProductCategory(productId, categoryId, subCategoryId) {
    return http.delete(
        `${apiEndpoint}/${productId}/${categoryId}/${subCategoryId}`
    );
}
