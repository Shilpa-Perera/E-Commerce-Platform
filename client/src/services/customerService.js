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
    const body = { ...customer };

    const mobiles = [];
    const addresses = [];

    for (let i = 0; i < body.addresses.length; i++) {
        const address = { ...body.addresses[i] };
        delete address.index;
        addresses.push(address);
    }
    for (let i = 0; i < body.mobiles.length; i++) {
        const mobile = { ...body.mobiles[i] };
        delete mobile.index;
        mobiles.push(mobile);
    }

    body.mobiles = mobiles;
    body.addresses = addresses;

    // console.log("saveCustomer", body);
    if (body.customer_id !== -1) {
        // update routine
        const url = customerUrl(body.customer_id);
        delete body.customer_id;

        // console.log("send to update url", body);
        return http.put(url, body);
    } else {
        // register routine
        delete body.customer_id;

        // console.log("post body: ", body);
        return http.post(apiEndpoint, body);
    }
}

export function deleteCustomer(customerId) {
    return http.delete(customerUrl(customerId));
}

export function deleteCustomerAddress(addressId) {
    return http.delete(`${apiEndpoint}/addresses/${addressId}`);
}

export function deleteCustomerMobile(mobileId) {
    return http.delete(`${apiEndpoint}/mobiles/${mobileId}`);
}
