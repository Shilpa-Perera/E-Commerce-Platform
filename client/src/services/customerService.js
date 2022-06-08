import http from "./httpService";

const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/customers";

function customerUrl(id) {
    return `${apiEndpoint}/${id}`;
}

export function getCustomers() {
    return http.get(apiEndpoint);
}

export function getCustomer(customerId) {
    return http.get(customerUrl(customerId));
}

export function saveCustomer(customer) {
    console.log(customer);
    if (customer.id) {
        const body = { ...customer };
        delete body.id;
        return http.put(customerUrl(customer.id), body);
    }
    return http.post(apiEndpoint, customer);
}

export function deleteCustomer(customerId) {
    return http.delete(customerUrl(customerId));
}