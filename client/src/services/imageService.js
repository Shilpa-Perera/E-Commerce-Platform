const apiUrl = process.env.REACT_APP_API_URL;
const endpoint = apiUrl + "/../images";

export function productImageUrl(imageName) {
    return `${endpoint}/products/${imageName}`;
}

export function variantImageUrl(imageName) {
    return `${endpoint}/variants/${imageName}`;
}
