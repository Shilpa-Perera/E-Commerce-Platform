import React, { Component } from "react";
import { getCustomers } from "./../../services/customerService";
import _ from "lodash";
import { paginate } from "../../utils/paginate";
import CustomersTable from "./customersTable";

class Customers extends Component {
    state = {
        customers: [],
        currentPage: 1,
        pageSize: 24,
        searchQuery: "",
        sortColumn: { path: "customer_id", order: "asc" },
    };

    async componentDidMount() {
        const { data: customers } = await getCustomers();
        this.setState({ customers: customers });
    }

    getPagedData = () => {
        const {
            customers: allCustomers,
            sortColumn,
            currentPage,
            pageSize,
            searchQuery,
        } = this.state;

        let filtered = allCustomers;

        const sorted = _.orderBy(
            filtered,
            (customer) => {
                return customer[sortColumn.path];
            },
            [sortColumn.order]
        );

        const customers = paginate(sorted, currentPage, pageSize);
        return { totalCount: 10, data: customers };
    };

    handleSort = (sortColumn) => {
        this.setState({ sortColumn: sortColumn });
    };

    render() {
        const { length: count } = this.state.customers;
        const { totalCount, data: customers } = this.getPagedData();
        const { sortColumn } = this.state;
        if (count === 0) return <p>There are no customers in the database.</p>;
        console.log("customers.jsx>customers: ", customers);
        return (
            <div className="container-fluid mb-5">
                <CustomersTable
                    customers={customers}
                    sortColumn={sortColumn}
                    onSort={this.handleSort}
                />
            </div>
        );
    }
}

export default Customers;
