import React, { Component } from "react";
import { IoArrowForward } from "react-icons/io5";
import { MdOutlineNoBackpack } from "react-icons/md";
import { Link } from "react-router-dom";
import Table from "../common/table";

class OrdersTable extends Component {
    columns = [
        { path: "order_id", label: "Order ID" },
        { path: "date", label: "Date" },
        { path: "order_name", label: "Name" },
        {
            key: "payment_method",
            content: ({ payment_method }) => (
                <span className="me-2 my-2 my-lg-0">{payment_method}</span>
            ),
            label: "payment method",
        },
        {
            key: "delivery_method",
            content: ({ delivery_method }) => (
                <span className="me-2 my-2 my-lg-0">{delivery_method}</span>
            ),
            label: "Delivery Method",
        },
        {
            key: "phone_number",
            content: ({ phone_number }) => (
                <span className="me-2 my-2 my-lg-0">{phone_number}</span>
            ),
            label: "Phone number",
        },
        {
            key: "order_idK",
            content: ({ order_id }) => (
                <div className="d-flex flex-column flex-lg-row mb-3">
                    <span className="me-2 my-2 my-lg-0">
                        <Link
                            to={
                                this.props.userType === "customer"
                                    ? `/customers/orders/${this.encryptOrderId(order_id)}`
                                    : `/orders/${order_id}`
                            }
                        >
                            <button className="btn btn-success btn-sm hover-focus">
                                <span className="me-2">View Order</span>
                                <i className="fa fa-eye"></i>
                            </button>
                        </Link>
                    </span>
                </div>
            ),
            label: "Action",
        },
    ];

    encryptOrderId(orderId) {
        var CryptoJS = require("crypto-js");

        // Encrypt
        var ciphertext = CryptoJS.AES.encrypt(
            orderId.toString(),
            "orderID SECRETKEY"
        ).toString();
        return ciphertext;
    }

    render() {
        const { orders, sortBy, onSort } = this.props;
        return (
            <div className="pb-5">
                <div className="container div-dark">
                    <h3 className="mb-4">Manage Orders</h3>
                    <div className="mt-5">
                        <div className="table-responsive order-table-container">
                            {orders.length !== 0 && (
                                <Table
                                    columns={this.columns}
                                    data={orders}
                                    sortColumn={sortBy}
                                    onSort={onSort}
                                />
                            )}
                            {orders.length === 0 && (
                                <div>
                                    <p className="fs-3 text-center fw-bold">
                                        Currently no orders
                                    </p>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            padding: "50px",
                                        }}
                                    >
                                        <MdOutlineNoBackpack
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
                                        {this.props.userType === "customer" && (
                                            <Link to="/products">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-primary"
                                                >
                                                    Continue Shopping
                                                    <IoArrowForward
                                                        style={{
                                                            marginLeft: 10,
                                                        }}
                                                    />
                                                </button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default OrdersTable;
