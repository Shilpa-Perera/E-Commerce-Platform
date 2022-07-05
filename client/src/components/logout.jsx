import React, { Component, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import auth from "../services/authService";
import { setCustomerId, getCartId, removeCart } from "../services/cartService";

function Logout({ setUser }) {
	const navigate = useNavigate();
	useEffect(() => {
		const user = auth.getCurrentUser();
		const cart_id = getCartId();

		if (user && cart_id !== undefined) {
			// not old carts login and just logout case
			const id = user.user_id;
			setCustomerId(getCartId(), id);
		}

		removeCart();
		auth.logoutUser();
		setUser(auth.getCurrentUser());
		navigate("/");
	}, []);
}

export default Logout;
