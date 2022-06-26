import React, { Component } from "react";

import { Link } from "react-router-dom";

import CheckoutCartCard from "./checkoutCartCard";
import Joi from "joi-browser";
import Form from "../common/form";

class CheckoutPayment extends Form {
    state = {
        paymentMethod: null,
        data: {
            firstName: "",
            cc_cvv: "",
            cc_expiration: "",
            cc_number: "",
            cc_name: "",
        },
        errors: [],
    };

    schema = {
        firstName: Joi.string().required().min(3).max(250).label("First Name"),
        cc_cvv: Joi.string()
            .regex(/^[0-9]+$/)
            .required()
            .min(3)
            .max(5)
            .label("CCV"),
        cc_expiration: Joi.string()
            .required()
            .min(8)
            .max(250)
            .label("Expiration Date"),
        cc_number: Joi.string().required().min(3).max(250).label("First Name"),
        cc_name: Joi.string().required().min(3).max(250).label("First Name"),
    };

    selectcash = () => {
        this.setState({ paymentMethod: "cash" });
    };

    selectcard = () => {
        this.setState({ paymentMethod: "card" });
    };

    doSubmit = async () => {
        console.log("to pay");
    };

    render() {
        const { paymentMethod } = this.state;

        const { data, deliveryEstimate, cartTotal } = this.props;
        console.log("in payment: ", data, deliveryEstimate);
        console.log(paymentMethod);
        return (
            <div>
                <div className="row p-5 div-dark">
                    <div className="col-12">
                        <label htmlFor="totalAmmount">
                            Estimated Delivery Time:
                        </label>
                        <li className="list-group-item" id="deliveryEstimate">
                            {deliveryEstimate} days
                        </li>
                    </div>
                    <div className="col-12">
                        <label htmlFor="totalAmmount">Total amount:</label>
                        <li className="list-group-item" id="totalAmount">
                            LKR {cartTotal}
                        </li>
                    </div>
                    <div className="col-12 d-block my-3">
                        <form onSubmit={this.handleSubmit}>
                            <h5 className="mb-3">Choose payment method</h5>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="flexRadioDefault"
                                    id="cashInput"
                                    onChange={this.selectcash}
                                ></input>
                                <label
                                    className="form-check-label"
                                    htmlFor="flexRadioDefault1"
                                >
                                    Cash
                                </label>
                            </div>

                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="flexRadioDefault"
                                    id="cardInput"
                                    onChange={this.selectcard}
                                ></input>
                                <label
                                    className="form-check-label"
                                    htmlFor="flexRadioDefault1"
                                >
                                    Card
                                </label>
                            </div>
                            {paymentMethod === "card" && (
                                <div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            {this.renderInput(
                                                "cc_name",
                                                "Name on card"
                                            )}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            {this.renderInput(
                                                "cc_number",
                                                "Card number"
                                            )}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-3 mb-3">
                                            {this.renderInput(
                                                "cc_expiration",
                                                "Expiration date"
                                            )}
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            {this.renderInput("cc_cvv", "CVV")}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div
                                className="btn-group col-2"
                                role="group"
                                aria-label="Basic mixed styles example"
                            >
                                <Link to="/cart">
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                    >
                                        Cancle
                                    </button>
                                </Link>

                                {/* Link is Temporary */}

                                {this.renderStyledButton("Confirm")}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default CheckoutPayment;
