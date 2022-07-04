import http from "./httpService";

const apiUrl = process.env.REACT_APP_API_URL;
const apiEndPoint = apiUrl + "/reports";

export function getProductInterestReport(id) {
    return http.get(`${apiEndPoint}/products/interest/${id}`);
}

export function getQuaterlySalesReport(year) {
    return http.get(`${apiEndPoint}/quaterly-sales-report/${year}`);
}

export function getMaxSaleProducts(start_date, end_date, number_of_rows) {
    return http.get(
        `${apiEndPoint}/max_sale/${start_date}/${end_date}/${number_of_rows}`
    );
}

export function getMostOrderCategories() {
    return http.get(`${apiEndPoint}/most-order-categories`);
}
