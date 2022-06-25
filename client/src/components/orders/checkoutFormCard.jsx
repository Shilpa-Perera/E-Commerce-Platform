import React, { Component } from "react";
import { Link } from "react-router-dom";
import Form from "../common/form";
import Joi from "joi-browser";

class CheckoutFormCard extends Form {
    // state = [{ payment: null, infor: null }];
    state = {
        data: {
            firstName: "",
            lastName: "",
            email: "",
            deliveryAddress: "",
            city: "",
            zipcode: "",
            price: "",
        },
        errors: [],
    };

    handleSubmit = (e) => {
        console.log("inside handle submit outside ");
        this.setState({ infor: this.form });
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
        price: Joi.number().required().min(1).label("Price"),
    };

    render() {
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

                    {/* <Link to={`/cart/checkout/payment`}> */}
                    <button
                        className="btn btn-primary btn-lg btn-block"
                        type=""
                    >
                        Proceed to Payment
                    </button>
                    {/* </Link> */}
                </div>
            </form>
        );
    }
}

export default CheckoutFormCard;
