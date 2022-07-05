import React, { Component } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Joi from "joi-browser";
import Form from "./common/form";
import auth from "../services/authService";
import {
	getCartIdByCusId,
	setOldCartId,
	getCartProducts,
} from "../services/cartService";

class LoginFormBody extends Form {
	state = {
		data: { username: "", password: "" },
		errors: {},
	};

	schema = {
		username: Joi.string().email().required().label("Username"),
		password: Joi.string().required().label("Password"),
	};

	doSubmit = async () => {
		try {
			const { data } = this.state;
			await auth.loginCustomer(data.username, data.password);

			/* cart implemetations */
			const { data: cart } = await getCartIdByCusId(
				auth.getCurrentUser().user_id
			);
			if (cart.cart_id) {
				setOldCartId(cart.cart_id);
				const { data: products } = await getCartProducts(cart.cart_id);
				this.props.onLogin(products.length);
			}

			this.props.setUser(auth.getCurrentUser());
			this.props.navigate("/");
		} catch (ex) {
			if (ex.response && ex.response.status === 400) {
				const errors = { ...this.state.errors };
				errors.username = ex.response.data;
				this.setState({ errors });
			}
		}
	};

	render() {
		if (auth.getCurrentUser()) return <Navigate to="/" />;

		return (
			<div className="container w-50 mb-5">
				<div className=" p-5 div-dark align-items-center justify-content-center">
					<div>
						<h1 className="text-center">Login</h1>

						<form onSubmit={this.handleSubmit}>
							{this.renderInput("username", "Username")}
							{this.renderInput(
								"password",
								"Password",
								"password"
							)}
							{this.renderButton("Login")}
						</form>
					</div>
				</div>
			</div>
		);
	}
}

const LoginForm = (props) => {
	const navigate = useNavigate();
	return <LoginFormBody {...props} navigate={navigate} />;
};

export default LoginForm;
