import React, { Component } from "react";
import CheckoutCartCard from "./checkoutCartCard";
import CheckoutFormCard from "./checkoutFormCard";
import { getCartId, getCartProducts } from "../../services/cartService";
import Loading from "../common/loading";
import { Link } from "react-router-dom";
import { IoArrowForward } from "react-icons/io5";
import { MdAddShoppingCart } from "react-icons/md";

class OrderCheckoutForm extends Component {
    state = {
        loading: true,
        cartId: null,
        variant: [],
        orderTotal: 0,
    };

    async CartProducts() {
        const cartId = getCartId();
        const { data: variant } = await getCartProducts(cartId);

        let orderTotal = 0;
        if (variant) {
            variant.forEach((element) => {
                orderTotal +=
                    parseFloat(element.price) * element.number_of_items;
            });
        }

        this.setState({ variant });
        this.setState({ orderTotal });
        this.setState({ cartId });
    }
    async componentDidMount() {
        await this.CartProducts();
        this.setState({ loading: false });
    }

    render() {
        const { variant, orderTotal, cartId } = this.state;
        if (this.state.loading) return <Loading />;
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
                                onCheckout={this.props.onCheckout}
                                cartId={cartId}
                                cardDetails={variant}
                                cartTotal={orderTotal}
                            />
                        </div>
                    </div>
                </div>
            );
        } else if (!cartId) {
            return (
                <div>
                    <p className="fs-3 text-center fw-bold">
                        Currently no items in the cart
                    </p>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            padding: "50px",
                        }}
                    >
                        <MdAddShoppingCart
                            size={100}
                            style={{ color: "grey" }}
                        />
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            padding: "50px",
                        }}
                    >
                        <Link to="/products">
                            <button
                                type="button"
                                className="btn btn-outline-primary"
                            >
                                Continue Shopping
                                <IoArrowForward style={{ marginLeft: 10 }} />
                            </button>
                        </Link>
                    </div>
                </div>
            );
        }
    }
}

export default OrderCheckoutForm;
