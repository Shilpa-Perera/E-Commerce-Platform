import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "../common/table";

class OrdersCartTable extends Component {
    columns = [
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
                        <button className="btn btn-success btn-sm hover-focus">
                            <span className="me-2">View Order</span>
                            <i className="fa fa-eye"></i>
                        </button>
                    </span>
                </div>
            ),
            label: "Action",
        },
    ];

    render() {
        const { orders, sortBy, onSort } = this.props;
        return (
            <div className="pb-5">
                <div className="container div-dark">
                    <div className="mt-5">
                        <div className="table-responsive order-table-container">
                            <Table
                                columns={this.columns}
                                data={orders}
                                sortColumn={sortBy}
                                onSort={onSort}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default OrdersCartTable;
