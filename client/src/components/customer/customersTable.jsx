import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "../common/table";

class CustomersTable extends Component {
    columns = [
        { path: "customer_id", label: "Customer ID" },
        { path: "name", label: "Name" },
        { path: "email", label: "Email" },
    ];
    render() {
        const { customers, sortColumn, onSort } = this.props;
        console.log("CustomersTable > customers: ", customers);
        return (
            <div>
                <Table
                    columns={this.columns}
                    data={customers}
                    // sortColumn={sortColumn}
                    // onSort={onSort}
                />
            </div>
        );
    }
}

export default CustomersTable;
