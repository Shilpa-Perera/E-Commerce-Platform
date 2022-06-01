import http from "./httpService";
import _ from "lodash";

const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/variants";

function variantUrl(id) {
    return `${apiEndpoint}/${id}`;
}

export function getVariant(product_id, options) {
    const body = JSON.stringify({ product_id, options });
    return http.get(apiEndpoint, { params: { body } });
}

export function updateVariant(variant) {
    return http.put(
        variantUrl(variant.variant_id),
        _.pick(variant, ["variant_name", "price", "quantity"])
    );
}
