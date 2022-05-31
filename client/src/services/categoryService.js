import http from "./httpService";

const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/categories";

function categoryUrl(id) {
    return `${apiEndpoint}/${id}`;
}

export function getCategories() {
    return http.get(apiEndpoint);
}

export function getSubCategories(category_id) {
    return http.get(categoryUrl(category_id));
}
