import React, { Component } from "react";
import { Link } from "react-router-dom";
import Form from "../common/form";
import Joi from "joi-browser";
import { setOrderDetails } from "../../services/orderService";
import { toast } from "react-toastify";
import CheckoutPayment from "./checkoutPayment";
import { getCurrentUser } from "../../services/authService";
import { getCustomer } from "../../services/customerService";
import Loading from "../common/loading";

class CheckoutFormCard extends Form {
    state = {
        loading: true,
        data: {
            firstName: "",
            lastName: "",
            email: "",
            deliveryAddress: "",
            city: "",
            zipcode: "",
            telephone: "",
        },
        cartId: null,
        page: null,
        estimatedDelivery: null,
        customerId: null,
        errors: [],
    };

    schema = {
        firstName: Joi.string().required().min(3).max(250).label("First Name"),
        lastName: Joi.string().required().min(3).max(250).label("Last Name"),
        email: Joi.string().required().email({ minDomainSegments: 2 }),
        deliveryAddress: Joi.string()
            .required()
            .max(1000)
            .label("Delivery Address"),

        city: Joi.string().required().min(1).max(250).label("City"),
        zipcode: Joi.string()
            .regex(/(^\d{5}$)|(^\d{5}-\d{4}$)/)
            .required()
            .min(5)
            .max(5)
            .label("ZIP Code"),
        telephone: Joi.string()
            .regex(/^\+?\d{0,3}\s?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/)
            .required()
            .min(10)
            .max(12)
            .label("Telephone Number"),
    };

    async componentDidMount() {
        let data = {
            firstName: "",
            lastName: "",
            email: "",
            deliveryAddress: "",
            city: "",
            zipcode: "",
            telephone: "",
        };
        const customerId = getCurrentUser();
        if (customerId) {
            try {
                await this.setState({ customerId: customerId.user_id });

                const { data: customer } = await getCustomer(
                    this.state.customerId
                );
                console.log(customer);
                const customerAddress =
                    customer.addresses[0].po_box +
                    ", " +
                    customer.addresses[0].street_name;
                data = {
                    firstName: customer.name,
                    lastName: customer.name,
                    email: customer.email,
                    deliveryAddress: customerAddress,
                    city: customer.addresses[0].city,
                    zipcode: customer.addresses[0].postal_code,
                    telephone: customer.mobiles[0].mobile,
                };
            } catch (error) {
                return this.setState({ data: data, loading: false });
            }
        }
        this.setState({ data: data, loading: false });
    }

    doSubmit = async () => {
        this.setState({ loading: true });
        let result = null;
        const cartId = this.props.cartId;
        const data = {
            firstName: "",
            lastName: "",
            email: "",
            deliveryAddress: "",
            city: "",
            zipcode: "",
            telephone: "",
        };
        await this.setState({ cartId: cartId });
        this.setState({ data });

        try {
            result = await setOrderDetails(this.state);
        } catch (error) {
            toast.error("Error occured. Try Again!");
        }
        if (result.data[1] === "All set") {
            const page = "payment";
            this.setState({ data: result.data[0] });
            this.setState({ page: page });
            this.setState({ estimatedDelivery: result.data[2] });
        } else {
            toast.warning(result.data[1]);
        }
        this.setState({ loading: false });
    };

    render() {
        console.log(this.state.errors);
        if (this.state.loading) return <Loading />;
        if (this.state.page === null) {
            return (
                <form onSubmit={this.handleSubmit}>
                    <div className="row p-5 div-dark">
                        <div className="col-6 form-group mb-3">
                            {this.renderInput("firstName", "First Name")}
                        </div>
                        <div className="col-6 form-group mb-3">
                            {this.renderInput("lastName", "Last Name")}
                        </div>

                        <div className="col-12 form-group mb-3">
                            {this.renderInput("email", "Email Address")}
                        </div>
                        <div className="col-12 form-group mb-3">
                            
                            {this.renderInputWithCustomError("telephone", "Telephone Number", "Invalid Telephone Number")}
                        </div>

                        <div className="col-12 form-group mb-3">
                            {this.renderInput(
                                "deliveryAddress",
                                "Delivery Address"
                            )}
                        </div>

                        <div className="col-6 form-group mb-3">
                            {this.renderInput("city", "City")}
                        </div>

                        <div className="col-6 form-group mb-3">
                            {this.renderInputWithCustomError("zipcode", "ZIP Code", "Invalid ZIP Code")}
                        </div>

                        <div className="col-12 form-group mb-3">
                            {this.renderStyledButton("Proceed to Payment")}
                        </div>
                    </div>
                </form>
            );
        } else if (this.state.page === "payment") {
            return (
                <div>
                    <CheckoutPayment
                        onCheckout={this.props.onCheckout}
                        data={this.state.data}
                        deliveryEstimate={this.state.estimatedDelivery}
                        cartTotal={this.props.cartTotal}
                        customerId={this.state.customerId}
                    />
                </div>
            );
        }
    }
}

export default CheckoutFormCard;
