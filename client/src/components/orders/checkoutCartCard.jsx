import React, { Component } from "react";

class CheckoutCartCard extends Component {
    placeItem(variantObj) {
        let block = null;
        block = variantObj.map((e) => {
            return (
                <li key={e.variant_id} className="list-group-item d-flex justify-content-between lh-condensed checkout-cart-list">
                    <div className="row">
                        <div className="col-11">
                            <h5 className="my-0 fw-normal fs-6">
                                {e.product_title}
                            </h5>
                            <small className="text-muted">
                                {e.variant_name}
                            </small>
                            <h6 className="fw-lighter">
                                Quantity: {e.number_of_items}
                            </h6>
                        </div>
                    </div>
                    <span className="text-muted">{e.price}</span>
                </li>
            );
        });
        return block;
    }

    state = { payment: null };
    render() {
        const { cardDetails, cartTotal } = this.props;
        if (cardDetails) {
            return (
                <div className="div-dark overflow-hidden">
                    <div className="list-group-item d-flex justify-content-between checkout-cart-list">
                        <strong className="my-0 fw-bold fs-6">
                            Product name
                        </strong>
                        <strong className="my-0 fw-bold fs-6">
                            Price(LKR)
                        </strong>
                    </div>
                    <div className="checkout-cart-container">
                        <ul className="list-group list-group-flush mb-3 checkout-cart-list">
                            {this.placeItem(cardDetails)}
                        </ul>
                    </div>
                    <div className="list-group-item d-flex justify-content-between checkout-cart-list">
                        <span>Total (LKR)</span>
                        <strong>{cartTotal}</strong>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="div-dark overflow-hidden">
                    <div className="list-group-item d-flex justify-content-between checkout-cart-list">
                        <strong className="my-0 fw-bold fs-6">
                            Product name
                        </strong>
                        <strong className="my-0 fw-bold fs-6">
                            Price(LKR)
                        </strong>
                    </div>
                    <div className="checkout-cart-container">
                        <ul className="list-group list-group-flush mb-3 checkout-cart-list">
                            <li className="list-group-item d-flex justify-content-between lh-condensed checkout-cart-list">
                                <span className="text-muted">
                                    No items in cart
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            );
        }
    }
}

export default CheckoutCartCard;
