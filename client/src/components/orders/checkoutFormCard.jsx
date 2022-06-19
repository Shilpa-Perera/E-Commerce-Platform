import React, { Component } from "react";


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

                <h5 className="mb-3">Payment method</h5>

                <div className="d-block my-3">
                    <div class="form-check">
                        <input
                            class="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="cashInput"
                        ></input>
                        <label class="form-check-label" for="flexRadioDefault1">
                            Cash
                        </label>
                    </div>

                    <div class="form-check">
                        <input
                            class="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="cardInput"
                        ></input>
                        <label class="form-check-label" for="flexRadioDefault1">
                            Card
                        </label>
                    </div>
                </div>
                <button
                    className="btn btn-primary btn-lg btn-block"
                    type="submit"
                >
                    Proceed to Payment
                </button>
                {/* </form> */}
            </div>
        );
    }
}

export default CheckoutFormCard;

{
    /* <div className="row">
<div className="col-md-6 mb-3">
    <label for="cc-name">Name on card</label>
    <input
        type="text"
        className="form-control"
        id="cc-name"
        placeholder=""
        required
    ></input>
    <small className="text-muted">
        Full name as displayed on card
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
        Credit card number is required
    </div>
</div>
</div>
<div className="row">
<div className="col-md-3 mb-3">
    <label for="cc-expiration">Expiration</label>
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
</div> */
}
