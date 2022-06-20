import React, { Component } from "react";

class CheckoutCartCard extends Component {
    state = [{ payment: null }];
    render() {
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
                                        <div className="row">
                                            <div className="col-11">
                                                <h5 className="my-0 fw-normal fs-6">
                                                    Polaroid 3000
                                                </h5>
                                                <small className="text-muted">
                                                    16GB Red Triple Camera dfs
                                                    df sdf sdf df
                                                </small>
                                                <h6 className="fw-lighter">
                                                    Quantity: 12
                                                </h6>
                                            </div>
                                        </div>
                                        <span className="text-muted">2000</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between  checkout-cart-list">
                                        <div className="row">
                                            <div className="col-11">
                                                <h5 className="my-0 fw-normal fs-6">
                                                    Samsung Galaxy S 22 Ultra
                                                </h5>
                                                <small className="text-muted">
                                                    16GB Red Triple Camera dfs
                                                    df sdf sdf df
                                                </small>
                                                <h6 className="fw-lighter">
                                                    Quantity: 2
                                                </h6>
                                            </div>
                                        </div>
                                        <span className="text-muted">12</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="list-group-item d-flex justify-content-between checkout-cart-list">
                                <span>Total(LKR)</span>
                                <strong>LKR2012</strong>
                            </div>
                        </div>
        );
    }
}

export default CheckoutCartCard;


