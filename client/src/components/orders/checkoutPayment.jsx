import React, { Component } from "react";
import CheckoutCartCard from "./checkoutCartCard";

class CheckoutPayment extends Component {
    state = { paymentMethod: null };
    selectcash = () => {
        this.setState({ paymentMethod: "cash" });
    };

    selectcard = () => {
        this.setState({ paymentMethod: "card" });
    };

    render() {
        const { paymentMethod } = this.state;
        console.log(paymentMethod);
        return (
            <div className="container h-100 py-5">
                <div className="row d-flex h-100">
                    <h3 className="d-inline-block">Checkout</h3>
                    <div className="col-md-4 order-md-2 mb-4 ">
                        <h4 className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-muted">Your cart</span>
                            <span className="badge badge-secondary badge-pill">
                                3
                            </span>
                        </h4>
                        <CheckoutCartCard/>
                        
                    </div>
                    {/* Form Area */}
                    <div className="col-md-8 order-md-1">
                        <h4 className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-muted">Payment Details</span>
                        </h4>

                        <div className="row p-5 div-dark">
                            <div className="d-block my-3">
                                <h5 className="mb-3">Payment method</h5>
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
                                                <label for="cc-name">
                                                    Name on card
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="cc-name"
                                                    placeholder=""
                                                    required
                                                ></input>
                                                <small className="text-muted">
                                                    Full name as displayed on
                                                    card
                                                </small>
                                                <div className="invalid-feedback">
                                                    Name on card is required
                                                </div>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label for="cc-number">
                                                    Credit card number
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="cc-number"
                                                    placeholder=""
                                                    required
                                                ></input>
                                                <div className="invalid-feedback">
                                                    Credit card number is
                                                    required
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-3 mb-3">
                                                <label for="cc-expiration">
                                                    Expiration
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="cc-expiration"
                                                    placeholder=""
                                                    required
                                                ></input>
                                                <div className="invalid-feedback">
                                                    Expiration date required
                                                </div>
                                            </div>
                                            <div className="col-md-3 mb-3">
                                                <label for="cc-cvv">CVV</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="cc-cvv"
                                                    placeholder=""
                                                    required
                                                ></input>
                                                <div className="invalid-feedback">
                                                    Security code required
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CheckoutPayment;
