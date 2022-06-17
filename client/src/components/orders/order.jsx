import React, { Component } from "react";
import { useParams } from "react-router-dom";
import { getOrder } from "../../services/orderService";
import OrdersCartTable from "./orderViewCartTable";

class OrderView extends Component {
    state = {
        order: null,
        cartId: null,
        cart: []
    };

    async componentDidMount() {
        const { id } = this.props;
        const { data: cart } = await getOrder(id);

        this.setState({ cart });
    }

    render() {
        const { id } = this.props;
        const { cart } = this.state;
        console.log(id);
        console.log(cart);
        return (
            <div className="pb-5">
                <div className="container div-dark">
                    <h3 className="mb-4">Manage Order ### WIP</h3>
                    <div className="mt-5">
                        <div className="mb-3 row">
                            <label for="f1" className="col-sm-4 col-form-label">
                                Order ID
                            </label>
                            <div className="col-sm-6">
                                <input
                                    type="text"
                                    readonly
                                    className="form-control-plaintext"
                                    id="f1"
                                    value={id}
                                />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label for="f1" className="col-sm-4 col-form-label">
                                Name on order
                            </label>
                            <div className="col-sm-6">
                                <input
                                    type="text"
                                    readonly
                                    className="form-control-plaintext"
                                    id="f1"
                                    value="Gotabaya Rajapaksa"
                                />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label for="f1" className="col-sm-4 col-form-label">
                                Date
                            </label>
                            <div className="col-sm-6">
                                <input
                                    type="text"
                                    readonly
                                    className="form-control-plaintext"
                                    id="f1"
                                    value="2022/02/25"
                                />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label for="f1" className="col-sm-4 col-form-label">
                                Delivery Address
                            </label>
                            <div className="col-sm-6">
                                <input
                                    type="text"
                                    readonly
                                    className="form-control-plaintext"
                                    id="f1"
                                    value="No. 69, Pohottu rd, Mirihana"
                                />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label for="f1" className="col-sm-4 col-form-label">
                                Telephone
                            </label>
                            <div className="col-sm-6">
                                <input
                                    type="text"
                                    readonly
                                    className="form-control-plaintext"
                                    id="f1"
                                    value="01169696969"
                                />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label for="f1" className="col-sm-4 col-form-label">
                                Delivery Method
                            </label>
                            <div className="col-sm-6">
                                <input
                                    type="text"
                                    readonly
                                    className="form-control-plaintext"
                                    id="f1"
                                    value="Tank"
                                />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label for="f1" className="col-sm-4 col-form-label">
                                Payment Method
                            </label>
                            <div className="col-sm-6">
                                <input
                                    type="text"
                                    readonly
                                    className="form-control-plaintext"
                                    id="f1"
                                    value="Cash"
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label for="f1" className="col-sm-4 col-form-label">
                                Cart {cart}
                            </label>
                            {/* <OrdersCartTable /> */}
                            <div className="col-sm-6"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function Order(props) {
    const { id } = useParams();
    return <OrderView {...{ props, id }} />;
}

export default Order;
