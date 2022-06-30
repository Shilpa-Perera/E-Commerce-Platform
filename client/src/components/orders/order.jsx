import React, { Component } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrder } from "../../services/orderService";
import { OrderStatus } from "./orderStatus";
import OrdersCartTable from "./orderViewCartTable";
import Loading from "../common/loading";

class OrderView extends Component {
    state = {
        order: null,
        cart: null,
        orderDetails: null,
    };

    async componentDidMount() {
        const { id } = this.props;
        const { data: s } = await getOrder(id);
        this.setState({ orderDetails: s.orderDetails, cart: s.orderCart });
    }

    setValues() {
        const { cart, orderDetails } = this.state;

        //If cart and orderDetails are empty
        if (cart !== null && orderDetails !== null) {
            return { orderDetails, cart };
        } else {
            return null;
        }
    }

    render() {
        const orderDisplayValues = this.setValues();
        if (orderDisplayValues) {
            let orderValues = null;
            let cart = null;
            try {
                orderValues = orderDisplayValues.orderDetails[0];
                console.log(orderValues); // ## WIP: temporary
                cart = orderDisplayValues.cart;
                let t = orderValues.order_id;
            } catch (error) {
                return (
                    <div className="pb-5">
                        <div className="container div-dark text-center">
                            <h2> Invalid order</h2>
                            <Link to={`/orders/`}>
                                <button className="btn btn-primary btn-sm hover-focus">
                                    <span className="me-2">Go to Orders</span>
                                    <i className="fa fa-refresh"></i>
                                </button>
                            </Link>
                        </div>
                    </div>
                );
            }

            return (
                <div className="container-fluid mb-5">
                    <div className="row">
                        <div className="container w-75 mb-5">
                            <div className="container div-dark">
                                <h3 className="mb-4">Manage Order</h3>
                                <div className="mt-5">
                                    <div className="mb-3 row">
                                        <label
                                            htmlFor="f1"
                                            className="col-sm-4 col-form-label font-weight-bold"
                                        >
                                            Order ID
                                        </label>
                                        <div className="col-sm-6">
                                            <input
                                                type="text"
                                                readOnly
                                                className="form-control-plaintext"
                                                id="f1"
                                                value={orderValues.order_id}
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3 row">
                                        <label
                                            htmlFor="f1"
                                            className="col-sm-4 col-form-label"
                                        >
                                            Name on order
                                        </label>
                                        <div className="col-sm-6">
                                            <input
                                                type="text"
                                                readOnly
                                                className="form-control-plaintext"
                                                id="f1"
                                                value={orderValues.order_name}
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3 row">
                                        <label
                                            htmlFor="f1"
                                            className="col-sm-4 col-form-label"
                                        >
                                            Date
                                        </label>
                                        <div className="col-sm-6">
                                            <input
                                                type="text"
                                                readOnly
                                                className="form-control-plaintext"
                                                id="f1"
                                                value={orderValues.date}
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3 row">
                                        <label
                                            htmlFor="f1"
                                            className="col-sm-4 col-form-label"
                                        >
                                            Delivery Address
                                        </label>
                                        <div className="col-sm-6">
                                            <input
                                                type="text"
                                                readOnly
                                                className="form-control-plaintext"
                                                id="f1"
                                                value={
                                                    orderValues.delivery_address
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3 row">
                                        <label
                                            htmlFor="f1"
                                            className="col-sm-4 col-form-label"
                                        >
                                            Telephone
                                        </label>
                                        <div className="col-sm-6">
                                            <input
                                                type="text"
                                                readOnly
                                                className="form-control-plaintext"
                                                id="f1"
                                                value={orderValues.phone_number}
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3 row">
                                        <label
                                            htmlFor="f1"
                                            className="col-sm-4 col-form-label"
                                        >
                                            Delivery Method
                                        </label>
                                        <div className="col-sm-6">
                                            <input
                                                type="text"
                                                readOnly
                                                className="form-control-plaintext"
                                                id="f1"
                                                value={
                                                    orderValues.delivery_method
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3 row">
                                        <label
                                            htmlFor="f1"
                                            className="col-sm-4 col-form-label"
                                        >
                                            Payment Method
                                        </label>
                                        <div className="col-sm-6">
                                            <input
                                                type="text"
                                                readOnly
                                                className="form-control-plaintext"
                                                id="f1"
                                                value={
                                                    orderValues.payment_method
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3 order-cart-div">
                                        <OrdersCartTable cartDetails={cart} />
                                    </div>

                                    <div className="mb-3 row">
                                        <OrderStatus
                                            status={{
                                                paymentState:
                                                    orderValues.payment_state,
                                                deliveryState:
                                                    orderValues.delivery_state,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="pb-5">
                    <div className="container div-dark">
                        <Loading />
                    </div>
                </div>
            );
        }
    }
}

function Order(props) {
    const { id } = useParams();
    return <OrderView {...{ props, id }} />;
}

export default Order;
