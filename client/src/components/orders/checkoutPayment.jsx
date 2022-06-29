import React from "react";
import { Link } from "react-router-dom";
import Joi from "joi-browser";
import Form from "../common/form";
import { validateAndConfirmOrder } from "../../services/orderService";
import { toast } from "react-toastify";
import { removeCart } from "../../services/cartService";

class CheckoutPayment extends Form {
    state = {
        paymentMethod: null,
        deliveryMethod: null,
        customerId: null,
        data: {
            deliv: "",
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
        deliv: Joi.string().required().min(4),
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
            deliv: this.state.data.deliv,
            cc_cvv: "000",
            cc_expiration: "00/00",
            cc_number: "00000000",
            cc_name: "000000",
        };
        this.setState({ paymentMethod: "CASH", data: data });
    };

    selectcard = () => {
        const data = {
            deliv: this.state.data.deliv,
            cc_cvv: "",
            cc_expiration: "",
            cc_number: "",
            cc_name: "",
        };
        this.setState({ paymentMethod: "CARD", data: data });
    };

    selectHomeDelivery = () => {
        const data = {
            deliv: "DELIVERY",
            cc_cvv: this.state.data.cc_cvv,
            cc_expiration: this.state.data.cc_expiration,
            cc_number: this.state.data.cc_number,
            cc_name: this.state.data.cc_name,
        };
        this.setState({ deliveryMethod: "DELIVERY", data: data });
    };
    selectStorePickup = () => {
        const data = {
            deliv: "PICKUP",
            cc_cvv: this.state.data.cc_cvv,
            cc_expiration: this.state.data.cc_expiration,
            cc_number: this.state.data.cc_number,
            cc_name: this.state.data.cc_name,
        };
        this.setState({ deliveryMethod: "STORE-PICKUP", data: data });
    };

    doSubmit = async () => {
        const details = {
            ...this.state.orderDetails,
            totalPrice: this.state.totalAmount,
            paymentMethod: this.state.paymentMethod,
            paymentDetails: this.state.data,
            deliveryMethod: this.state.deliveryMethod,
            customerId: this.state.customerId,
        };

        const { data } = await validateAndConfirmOrder(details);

        // console.log(data);
        if (data[1] === "Payment Failed") {
            toast.warning("Payment Failed. Try again", {
                theme: "dark",
            });
            return;
        }
        const { newOrderId } = data[1][0][6][0];
        console.log(data[1][0]);
        console.log(newOrderId);
        removeCart();
        // remove cart from session
        window.location = "/order-summary/" + newOrderId;
    };

    render() {
        const {
            paymentMethod,
            totalAmount: cartTotal,
            orderDetails,
        } = this.state;

        const { deliveryEstimate } = this.props;
        if (orderDetails && cartTotal) {
            const readOnlyOrderData = orderDetails.data;
            return (
                <div>
                    <div className="row p-5 div-dark">
                        <div className="col-12 mb-3">
                            <label htmlFor="fullname">Full name:</label>
                            <li
                                className="list-group-item text-break"
                                id="fullname"
                            >
                                {readOnlyOrderData.firstName +
                                    " " +
                                    readOnlyOrderData.lastName}
                            </li>
                        </div>

                        <div className="col-12 mb-3">
                            <label htmlFor="email">Email address:</label>
                            <li
                                className="list-group-item text-break"
                                id="email"
                            >
                                {readOnlyOrderData.email}
                            </li>
                        </div>

                        <div className="col-12 mb-3">
                            <label htmlFor="telephone">Telephone Number:</label>
                            <li
                                className="list-group-item text-break"
                                id="telephone"
                            >
                                {readOnlyOrderData.telephone}
                            </li>
                        </div>

                        <div className="col-12 mb-3">
                            <label htmlFor="deliveryAddress">
                                Delivery Address:
                            </label>
                            <li
                                className="list-group-item text-break"
                                id="deliveryAddress"
                            >
                                {readOnlyOrderData.deliveryAddress}
                            </li>
                        </div>

                        <div className="col-6 mb-3">
                            <label htmlFor="city">City:</label>
                            <li
                                className="list-group-item text-break"
                                id="city"
                            >
                                {readOnlyOrderData.city}
                            </li>
                        </div>

                        <div className="col-6 mb-3">
                            <label htmlFor="zipcode">ZIP code:</label>
                            <li
                                className="list-group-item text-break"
                                id="zipcode"
                            >
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
                            <label htmlFor="totalAmmount text-break">
                                Total amount:
                            </label>
                            <li className="list-group-item" id="totalAmount">
                                LKR {cartTotal}
                            </li>
                        </div>

                        <div className="col-12 d-block my-3">
                            <form onSubmit={this.handleSubmit}>
                                <div className="mb-3">
                                    <h5 className="mb-3">
                                        Choose Delivery Method
                                    </h5>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="delivery"
                                            id="homeDelivery"
                                            onChange={this.selectHomeDelivery}
                                        ></input>
                                        <label
                                            className="form-check-label"
                                            htmlFor="delivery"
                                        >
                                            Home Delivery
                                        </label>
                                    </div>

                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="delivery"
                                            id="storePickup"
                                            onChange={this.selectStorePickup}
                                        ></input>
                                        <label
                                            className="form-check-label"
                                            htmlFor="delivery"
                                        >
                                            Store Pickup
                                        </label>
                                    </div>
                                </div>

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

                                {paymentMethod === "CARD" && (
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
