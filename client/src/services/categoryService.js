import http from "./httpService";

const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/categories";

function categoryUrl(id) {
    return `${apiEndpoint}/${id}`;
}

export function getCategories() {
    return http.get(`${apiEndpoint}/category`);
}

export function getAllSubCategories() {
    return http.get(`${apiEndpoint}/sub-category`);
}

export function getSubCategories(category_id) {
    return http.get(categoryUrl(category_id));
}

export function getSubCategoriesToLink(category_id) {
    return http.get(`${apiEndpoint}/link-category/${category_id}`);
}

export function addCategory(newCategoryName) {
    return http.post(`${apiEndpoint}/add-category`, {
        new_category_name: newCategoryName,
    });
}

export function addSubCategory(newSubCategoryName) {
    return http.post(`${apiEndpoint}/add-sub-category`, {
        new_sub_category_name: newSubCategoryName,
    });
}

export function linkSubCategories(category_id, sub_category_id) {
    return http.post(`${apiEndpoint}/link-category`, {
        category_id: category_id,
        sub_category_id: sub_category_id,
    });
}
