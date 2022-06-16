import React, { Component } from "react";
import _ from "lodash";
import { Link } from "react-router-dom";
import { getOrders } from "../../services/orderService";
import { paginate } from "../../utils/paginate";
import OrdersTable from "./ordersTable";
import SearchBox from "../common/searchBox";

class Orders extends Component {
    state = {
        orders: [],
        searchQuery: "",
        currentPage: 1,
        pageSize: 24,
        sortBy: { path: "order_id", order: "asc" },
    };
    sortOptions = [
        { id: "order_id", name: "Order" },
        { id: "date", name: "Date" },
    ];

    orderOptions = [
        { id: "asc", name: "Ascending" },
        { id: "desc", name: "Descending" },
    ];

    async componentDidMount() {
        const { data: orders } = await getOrders();
        this.setState({ orders });
    }

    handleSearch = (searchQuery) => {
        this.setState({
            searchQuery,
            currentPage: 1,
        });
    };

    handleSortClick = (id) => {
        this.setState({ sortBy: { path: id, order: "asc" } });
    };

    handleOptionClick = (id) => {
        const sortBy = { ...this.state.sortBy };
        sortBy.order = id;
        this.setState({ sortBy });
    };

    handleSort = (sortBy) => {
        if (sortBy.path) this.setState({ sortBy });
    };

    getPagedData = () => {
        const {
            orders: allOrders,
            sortBy,
            currentPage,
            pageSize,
            searchQuery,
        } = this.state;

        let filtered = allOrders;
        if (searchQuery)
            filtered = allOrders.filter((p) => {
                const title = p.order_id;
                const queryRegEx = new RegExp(
                    `.*${searchQuery}.*`
                );
                return queryRegEx.test(title);
            });

        const orders = paginate(filtered, currentPage, pageSize);
        return { totalCount: 10, data: orders };
    };

    render() {
        const {
            searchQuery,
        } = this.state;
        const { totalCount, data: orders } = this.getPagedData();
        const plh = "Enter Order Id";
        // console.log(orders);
        return (
            <div className="container-fluid mb-5">
                <div className="row">
                    <div className="col-md-8 col-lg-9 col-xxl-10">
                        <div className="container w-75 mb-5">
                            <div className="p-3 div-dark">
                                <SearchBox
                                    value={searchQuery}
                                    onChange={this.handleSearch}
                                    placeholder = {plh}
                                />
                            </div>
                        </div>
                        <OrdersTable
                            orders={orders}
                            sortBy={this.state.sortBy}
                            onSort={this.handleSort}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Orders;
