import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "../common/table";

class OrdersTable extends Component {
    columns = [
        { path: "order_id", label: "Order Id" },
        { path: "date", label: "Date" },
        { path: "order_name", label: "Name" },
        { path: "payment_method", label: "payment method" },
        { path: "delivery_method", label: "Delivery Method" },
        { path: "phone_number", label: "Phone number" },
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
