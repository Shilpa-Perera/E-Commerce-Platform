import React, { Component } from "react";
import CartCard from "../cartCard";
import CheckoutCartCard from "./checkoutCartCard";
import CheckoutFormCard from "./checkoutFormCard";

class OrderCheckoutForm extends Component {
    state = [{ payment: null }];
    render() {
        return (
            <div className="container h-100 py-5">
                <div className="row d-flex h-100">
                    <h3 className="d-inline-block">Checkout</h3>
                    {/* cart card */}
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
                            <span className="text-muted">Order Details</span>
                        </h4>

                        <CheckoutFormCard/>

                    </div>
                </div>
            </div>
        );
    }
}

export default OrderCheckoutForm;