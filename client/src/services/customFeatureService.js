import http from "./httpService";
import _ from "lodash";

const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/products/feature";

function featureUrl(id) {
    return `${apiEndpoint}/${id}`;
}

export function saveCustomFeature(customFeature, productId) {
    return http.post(apiEndpoint, {
        product_id: productId,
        custom_feature: customFeature,
    });
}

export function updateCustomFeature(customFeature, customFeatureId) {
    return http.put(featureUrl(customFeatureId), customFeature);
}

export function deleteCustomFeature(customFeatureId) {
    return http.delete(featureUrl(customFeatureId));
}
