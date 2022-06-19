import React, { Component } from "react";
import { Link } from "react-router-dom";

class CheckoutFormCard extends Component {
    state = [{ payment: null }];
    render() {
        return (
            <div className="row p-5 div-dark">
                {/* <form action=""> */}
                <div className="col-6 form-group mb-3">
                    <label for="firstName">First name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        placeholder=""
                        required
                    ></input>
                </div>
                <div className="col-6 form-group mb-3">
                    <label for="lastName">Last name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        placeholder=""
                        required
                    ></input>
                    <div className="invalid-feedback">
                        Valid last name is required.
                    </div>
                </div>

                <div className="col-12 form-group mb-3">
                    <label for="email">Email </label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="you@example.com"
                    ></input>
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

                <Link to={`/cart/checkout/payment`}>
                    <button
                        className="btn btn-primary btn-lg btn-block"
                        type="submit"
                    >
                        Proceed to Payment
                    </button>
                </Link>

                {/* </form> */}
            </div>
        );
    }
}

export default CheckoutFormCard;
