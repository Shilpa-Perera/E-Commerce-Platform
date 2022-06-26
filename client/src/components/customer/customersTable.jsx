import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "../common/table";

class CustomersTable extends Component {
    columns = [
        { path: "customer_id", label: "Customer ID" },
        {
            path: "name",
            label: "Name",
            content: (customer) => (
                <Link to={`/customers/${customer.customer_id}`}>
                    {customer.name}
                </Link>
            ),
        },
        { path: "email", label: "Email" },
    ];
    render() {
        const { customers, sortColumn, onSort } = this.props;
        // console.log("CustomersTable > customers: ", customers);
        return (
            <div className="pb-5">
                <div className="container div-dark">
                    <h3 className="mb-4">Manage Customers</h3>
                    <div className="mt-5">
                        <div className="table-responsive order-table-container">
                            <Table
                                columns={this.columns}
                                data={customers}
                                sortColumn={sortColumn}
                                onSort={onSort}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CustomersTable;
