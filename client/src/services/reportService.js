import http from "./httpService";

const apiUrl = process.env.REACT_APP_API_URL;
const apiEndPoint = apiUrl + "/reports";

export function getProductInterestReport(id) {
    return http.get(`${apiEndPoint}/products/interest/${id}`);
}

export function getQuaterlySalesReport(year) {
    return http.get(`${apiEndPoint}/quaterly-sales-report/${year}`);
}
