import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "../common/table";

class OrdersTable extends Component {
    columns = [
        { path: "order_id", label: "Order Id" },
        { path: "date", label: "Date" },
        { path: "order_name", label: "Name" },
        {
            content: ({ payment_method }) => (
                <div className="d-flex flex-column flex-lg-row mb-3">
                    <span className="me-2 my-2 my-lg-0">
                        {payment_method}
                    </span>
                </div>
            ), label: "payment method"
        },
        {
            content: ({ delivery_method }) => (
                <div className="d-flex flex-column flex-lg-row mb-3">
                    <span className="me-2 my-2 my-lg-0">
                        {delivery_method}
                    </span>
                </div>
            ), label: "Delivery Method"
        },
        {
            content: ({ phone_number }) => (
                <div className="d-flex flex-column flex-lg-row mb-3">
                    <span className="me-2 my-2 my-lg-0">
                        {phone_number}
                    </span>
                </div>
            ), label: "Phone number"
        },
    ];

    render() {
        const { orders, sortBy, onSort } = this.props;
        console.log(orders);
        return (
            <div className="pb-5">
                <div className="container div-dark">
                    <h3 className="mb-4">Manage Order</h3>
                    <div className="mt-5">
                        <div className="table-responsive">
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

export default OrdersTable;
