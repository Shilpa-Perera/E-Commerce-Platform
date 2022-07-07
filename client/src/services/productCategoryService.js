import http from "./httpService";

const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/products/product-categories";

export function saveProductCategory(productCategory, productId) {
    if (productCategory.sub_category_id)
        return http.post(apiEndpoint, {
            product_id: productId,
            product_category: productCategory,
        });
    else
        return http.post(`${apiEndpoint}/default`, {
            product_id: productId,
            product_category: productCategory,
        });
}

export function deleteProductCategory(productId, categoryId, subCategoryId) {
    if (subCategoryId)
        return http.delete(
            `${apiEndpoint}/${productId}/${categoryId}/${subCategoryId}`
        );
    else
        return http.delete(`${apiEndpoint}/default/${productId}/${categoryId}`);
}
