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
            deliveryAddress: ""
            
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
        email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
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
                        <div className="invalid-feedback">
                            Valid last name is required.
                        </div>
                    </div>

                    <div className="col-12 form-group mb-3">
                    {this.renderInput("email", "Email Address")}
                        {/* <label for="email">Email </label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="you@example.com"
                        ></input> */}
                    </div>

                    <div className="col-12 form-group mb-3">
                        <label for="address">Delivery address</label>
                        <input
                            type="text"
                            className="form-control"
                            id="address"
                            placeholder="1234 Main St"
                            required
                        ></input>
                    </div>

                    <div className="col-6 form-group mb-3">
                        <label for="city">City</label>
                        <input
                            type="text"
                            className="form-control"
                            id="city"
                            placeholder=""
                            required
                        ></input>
                    </div>

                    <div className="col-6 form-group mb-3">
                        <label for="zip">Zip</label>
                        <input
                            type="text"
                            className="form-control"
                            id="zip"
                            placeholder=""
                            required
                        ></input>
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
