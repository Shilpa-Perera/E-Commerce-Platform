import React, { Component } from "react";
import { Link } from "react-router-dom";
import Form from "../common/form";
import Joi from "joi-browser";
import { setOrderDetails } from "../../services/orderService";
import { toast } from "react-toastify";
import CheckoutPayment from "./checkoutPayment";

class CheckoutFormCard extends Form {
    state = {
        data: {
            firstName: "",
            lastName: "",
            email: "",
            deliveryAddress: "",
            city: "",
            zipcode: "",
        },
        cartId: null,
        page: null,
        estimatedDelivery: null,
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
        zipcode: Joi.string().required().min(5).max(5).label("ZIP Code"),
    };

    componentDidMount() {
        const data = {
            firstName: "a",
            lastName: "b",
            email: "c",
            deliveryAddress: "d",
            city: "e",
            zipcode: "f",
        };
        this.setState({ data: data });
        
    }

    doSubmit = async () => {
        let result = null;
        const cartId = this.props.cartId;
        const data = {
            firstName: "",
            lastName: "",
            email: "",
            deliveryAddress: "",
            city: "",
            zipcode: "",
        };
        await this.setState({ cartId: cartId });
        this.setState({ data });

        try {
            result = await setOrderDetails(this.state);
        } catch (error) {
            toast.error("Error occured. Try Again!")
        }
        if (result.data[1] === "All set") {
            const page = "payment";
            this.setState({data:result.data[0]});
            this.setState({page:page})
            this.setState({estimatedDelivery:result.data[2]})
        } else {
            toast.warning(result.data[1]);
        }
    };

    render() {
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
                            {this.renderInput(
                                "deliveryAddress",
                                "Delivery Address"
                            )}
                        </div>

                        <div className="col-6 form-group mb-3">
                            {this.renderInput("city", "City")}
                        </div>

                        <div className="col-6 form-group mb-3">
                            {this.renderInput("zipcode", "ZIP Code")}
                        </div>


                        <div className="col-12 form-group mb-3">
                            {this.renderStyledButton("Proceed to Payment")}
                        </div>
                    </div>
                </form>
            );
        }
        else if(this.state.page === "payment"){
            return (

                <CheckoutPayment data ={this.state.data} deliveryEstimate = {this.state.estimatedDelivery} cartTotal = {this.props.cartTotal}/>
            )
        }
    }
}

export default CheckoutFormCard;
