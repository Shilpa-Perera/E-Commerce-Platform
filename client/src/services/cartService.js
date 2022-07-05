import http from "./httpService";
import _ from "lodash";
import { EncryptStorage } from "encrypt-storage";

const encrtption_key = process.env.REACT_APP_ENCRYPTION_KEY;
export const encryptStorage = new EncryptStorage(encrtption_key, {
	prefix: "@cart",
	storageType: "sessionStorage",
});

const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/cart";

function productUrl(id) {
	return `${apiEndpoint}/products/${id}`;
}

function newCartUrl() {
	return `${apiEndpoint}/new`;
}

function deleteUrl(cart_id, variant_id) {
	return `${apiEndpoint}/${cart_id}/${variant_id}`;
}

export function getCartProducts(cart_id) {
	return http.get(productUrl(cart_id));
}

export function updateItemCount(cart_id, variant_id, number_of_items) {
	return http.put(apiEndpoint, {
		cart_id: cart_id,
		variant_id: variant_id,
		number_of_items: number_of_items,
	});
}

export function deletedProduct(cart_id, variant_id) {
	return http.delete(deleteUrl(cart_id, variant_id));
}

export async function setCartId() {
	const local_id = encryptStorage.getItem("cart_id");
	if (!local_id) {
		const { data: cart_id } = await getNewCartId();
		encryptStorage.setItem("cart_id", cart_id.cart_id);
	}
}

export function setOldCartId(cart_id) {
	removeCart();
	encryptStorage.setItem("cart_id", cart_id);
}

export function setCustomerId(cart_id, customer_id) {
	//setting customer id in cart when logging out
	return http.put(`${apiEndpoint}/${cart_id}`, { customer_id: customer_id });
}

export function getCartId() {
	return encryptStorage.getItem("cart_id");
}

export function removeCart() {
	encryptStorage.removeItem("cart_id");
	// sessionStorage.setItem("item_count", 0);
}

export async function getItemCount(cart_id) {
	const { data: products } = await getCartProducts(cart_id);
	return products.length;
}

export function addProductToCart(obj) {
	return http.post(apiEndpoint, obj);
}

export function getNewCartId() {
	return http.get(newCartUrl());
}

export function getCartIdByCusId(customer_id) {
	return http.get(`${apiEndpoint}/${customer_id}`);
}
