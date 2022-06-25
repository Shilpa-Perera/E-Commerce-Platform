import React, { Component } from "react";
import CheckoutCartCard from "./checkoutCartCard";
import CheckoutFormCard from "./checkoutFormCard";
import { getCartProducts } from "../../services/cartService";
import NotFound from "../notFound";

class OrderCheckoutForm extends Component {
    state = {
        variant: [],
        orderTotal: 0,
    };

    async CartProducts() {
        const { data: variant } = await getCartProducts(
            localStorage.getItem("cart_id")
        );

        let orderTotal = 0;
        if (variant) {
            variant.forEach((element) => {
                orderTotal +=
                    parseFloat(element.price) * element.number_of_items;
            });
        }

        this.setState({ variant });
        this.setState({ orderTotal });
    }
    async componentDidMount() {
        await this.CartProducts();
    }

    render() {
        const { variant, orderTotal } = this.state;
        console.log(variant, orderTotal);
        if (variant && orderTotal) {
            return (
                <div className="container h-100 py-5">
                    <div className="row d-flex h-100">
                        <h3 className="d-inline-block">Checkout</h3>
                        {/* cart card */}
                        <div className="col-md-4 order-md-2 mb-4 ">
                            <h4 className="d-flex justify-content-between align-items-center mb-3">
                                <span className="text-muted">Your cart</span>
                                <span className="badge badge-secondary badge-pill">
                                    {variant.length}
                                </span>
                            </h4>
                            <CheckoutCartCard
                                cardDetails={variant}
                                cartTotal={orderTotal}
                            />
                        </div>
                        {/* Form Area */}
                        <div className="col-md-8 order-md-1">
                            <h4 className="d-flex justify-content-between align-items-center mb-3">
                                <span className="text-muted">
                                    Order Details
                                </span>
                            </h4>

                            <CheckoutFormCard
                                cardDetails={variant}
                                cartTotal={orderTotal}
                            />
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default OrderCheckoutForm;
