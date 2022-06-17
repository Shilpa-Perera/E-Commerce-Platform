import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "../common/table";

class OrdersCartTable extends Component {
    columns = [
        {
            key: "phone_number",
            content: ({ phone_number }) => (
                <span className="me-2 my-2 my-lg-0">{phone_number}</span>
            ),
            label: "Phone number",
        },
    ];

    render() {
        const { orders, sortBy, onSort, cartDetails } = this.props;
        console.log(cartDetails);
        return (
            <div className="pb-5">
                <div className="container div-dark">
                    <div className="mt-5">
                        <div className="table-responsive order-table-container">
                            {cartDetails.map((e) => {
                                let name = e.variant_name;
                                console.log(name);
                                return <div key={name}>{name}</div>;
                            })}
                            {/* <Table
                                columns={this.columns}
                                data={orders}
                                sortColumn={sortBy}
                                onSort={onSort}
                            /> */}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default OrdersCartTable;
