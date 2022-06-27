import React from "react";

import { Link } from "react-router-dom";
import Joi from "joi-browser";
import Form from "../common/form";
import { validateAndConfirmOrder } from "../../services/orderService";

class CheckoutPayment extends Form {
    state = {
        paymentMethod: null,
        data: {
            cc_cvv: "",
            cc_expiration: "",
            cc_number: "",
            cc_name: "",
        },
        orderDetails: null,
        totalAmount: null,
        errors: [],
    };

    schema = {
        cc_cvv: Joi.string()
            .regex(/^[0-9]+$/)
            .required()
            .min(3)
            .max(5)
            .label("CCV"),
        cc_expiration: Joi.string()
            .required()
            .min(4)
            .max(250)
            .label("Expiration Date"),
        cc_number: Joi.string().required().min(3).max(250).label("First Name"),
        cc_name: Joi.string().required().min(3).max(250).label("First Name"),
    };

    componentDidMount() {
        this.setState({
            orderDetails: this.props.data,
            totalAmount: this.props.cartTotal,
        });
    }

    selectcash = () => {
        const data = {
            cc_cvv: "000",
            cc_expiration: "00/00",
            cc_number: "00000000",
            cc_name: "000000",
        };
        this.setState({ paymentMethod: "cash", data: data });
    };

    selectcard = () => {
        const data = {
            cc_cvv: "",
            cc_expiration: "",
            cc_number: "",
            cc_name: "",
        };
        this.setState({ paymentMethod: "card", data: data });
    };

    doSubmit = async () => {
        console.log("to pay");
        const details = {
            ...this.state.orderDetails,
            totalPrice: this.state.totalAmount,
            paymentMethod: this.state.paymentMethod,
            paymentDetails: this.state.data,
        };

        await validateAndConfirmOrder(details);
    };

    render() {
        const {
            paymentMethod,
            totalAmount: cartTotal,
            orderDetails,
        } = this.state;

        const { deliveryEstimate } = this.props;

        console.log(paymentMethod);
        if (orderDetails && cartTotal) {
            console.log(
                "in payment: ",
                deliveryEstimate,
                orderDetails,
                this.state.totalAmount
            );
            const readOnlyOrderData = orderDetails.data;
            return (
                <div>
                    <div className="row p-5 div-dark">
                        <div className="col-12 mb-3">
                            <label htmlFor="fullname">Full name:</label>
                            <li className="list-group-item text-break" id="fullname">
                                {readOnlyOrderData.firstName +
                                    " " +
                                    readOnlyOrderData.lastName}
                            </li>
                        </div>

                        <div className="col-12 mb-3">
                            <label htmlFor="email">Email address:</label>
                            <li className="list-group-item text-break" id="email">
                                {readOnlyOrderData.email}
                            </li>
                        </div>

                        <div className="col-12 mb-3">
                            <label htmlFor="deliveryAddress">
                                Delivery Address:
                            </label>
                            <li className="list-group-item text-break" id="deliveryAddress">
                                {readOnlyOrderData.deliveryAddress}
                            </li>
                        </div>

                        <div className="col-6 mb-3">
                            <label htmlFor="city">City:</label>
                            <li className="list-group-item text-break" id="city">
                                {readOnlyOrderData.city}
                            </li>
                        </div>

                        <div className="col-6 mb-3">
                            <label htmlFor="zipcode">ZIP code:</label>
                            <li className="list-group-item text-break" id="zipcode">
                                {readOnlyOrderData.zipcode}
                            </li>
                        </div>

                        <div className="col-12 mb-3">
                            <label htmlFor="deliveryEstimate">
                                Estimated Delivery Time:
                            </label>
                            <li
                                className="list-group-item text-break"
                                id="deliveryEstimate"
                            >
                                {deliveryEstimate} days
                            </li>
                        </div>

                        <div className="col-12 mb-3">
                            <label htmlFor="totalAmmount text-break">Total amount:</label>
                            <li className="list-group-item" id="totalAmount">
                                LKR {cartTotal}
                            </li>
                        </div>

                        <div className="col-12 d-block my-3">
                            <form onSubmit={this.handleSubmit}>
                                <div className="mb-3">
                                    <h5 className="mb-3">
                                        Choose payment method
                                    </h5>
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
                                                {this.renderInput(
                                                    "cc_cvv",
                                                    "CVV"
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="row">
                                    <div className="col-3">
                                        <Link to="/cart">
                                            <button
                                                type="button"
                                                class="btn btn-danger hover-focus"
                                            >
                                                Cancle
                                            </button>
                                        </Link>
                                    </div>

                                    {/* Link is Temporary */}
                                    <div className="col-3">
                                        {this.renderStyledButton(
                                            "Confirm",
                                            "hover-focus btn-success"
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default CheckoutPayment;
