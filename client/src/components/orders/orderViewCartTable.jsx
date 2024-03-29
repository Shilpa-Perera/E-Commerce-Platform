import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "../common/table";

class OrdersCartTable extends Component {
    columns = [
        {
            key: "variant ID",
            content: ({ variant_id, product_id }) => (
                <Link to={`/products/${product_id}`}>
                    <span className="me-2 my-2 my-lg-0">{variant_id}</span>
                </Link>
            ),
            label: "variant ID",
        },
        {
            key: "Name",
            content: ({ variant_name }) => (
                <span className="me-2 my-2 my-lg-0">{variant_name}</span>
            ),
            label: "Name",
        },
        {
            key: "Quantity",
            content: ({ number_of_items }) => (
                <span className="me-2 my-2 my-lg-0">{number_of_items}</span>
            ),
            label: "Quantity",
        },
    ];

    render() {
        const { sortBy, onSort, cartDetails } = this.props;
        return (
            <div className="order-cart-table">
                <h5>Cart Items</h5>
                <div className="table-responsive order-cart-table-container order-table-container">
                    <Table
                        columns={this.columns}
                        data={cartDetails}
                        sortColumn={sortBy}
                        onSort={onSort}
                    />
                </div>
            </div>
        );
    }
}

export default OrdersCartTable;
