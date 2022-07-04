import React, { Component } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrder } from "../../services/orderService";
import { OrderStatus } from "./orderStatus";
import OrdersCartTable from "./orderViewCartTable";
import Loading from "../common/loading";
import NotFound from "../notFound";

class OrderView extends Component {
    state = {
        loading: true,
        order: null,
        cart: null,
        orderDetails: null,
    };

    async componentDidMount() {
        const { id } = this.props;
        const { data: s } = await getOrder(id);
        this.setState({
            orderDetails: s.orderDetails,
            cart: s.orderCart,
            loading: false,
        });

        this.setValues();
    }

    setValues() {
        const { cart, orderDetails } = this.state;
        try {
            //If cart and orderDetails are empty
            if (cart.length !== 0 && orderDetails.length !== 0) {
                this.setState({ loading: false });
                return { orderDetails, cart };
            } else {
                this.setState({ loading: false });
                return null;
            }
        } catch (error) {}
    }

    render() {
        if (this.state.loading === true) {
            return <Loading />;
        }
        const { orderDetails, cart } = this.state;
        const orderDisplayValues = orderDetails[0];
        if (orderDisplayValues) {
            const orderValues = orderDisplayValues;
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
                                            Date and time
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
                                            htmlFor="f5"
                                            className="col-sm-4 col-form-label"
                                        >
                                            ZIP code
                                        </label>
                                        <div className="col-sm-6">
                                            <input
                                                type="text"
                                                readOnly
                                                className="form-control-plaintext"
                                                id="f5"
                                                value={
                                                    orderValues.zip_code
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
                                            orderId={orderValues.order_id}
                                            orderPaymentMethod={
                                                orderValues.payment_method
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return NotFound();
        }
    }
}

function Order(props) {
    const { id } = useParams();
    return <OrderView {...{ props, id }} />;
}

export default Order;
