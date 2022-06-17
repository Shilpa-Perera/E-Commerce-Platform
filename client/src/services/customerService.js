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
    // console.log(customer);
    if (customer.customer_id !== -1) {
        const body = { ...customer };
        delete body.customer_id;
        console.log("send to update url", body);
        return {res: "success"};
        // return http.put(customerUrl(customer.id), body);
    }
    // return http.post(apiEndpoint, customer);
}

export function deleteCustomer(customerId) {
    return http.delete(customerUrl(customerId));
}