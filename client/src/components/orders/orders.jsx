import React, { Component } from "react";
import _ from "lodash";
import { getCustomerOrders, getOrders } from "../../services/orderService";
import { paginate } from "../../utils/paginate";
import OrdersTable from "./ordersTable";
import SearchBox from "../common/searchBox";
import Pagination from "../common/pagination";
import { getCurrentUser } from "../../services/authService";
import Loading from "../common/loading";

class Orders extends Component {
    state = {
        loading: true,
        userType: null,
        orders: [],
        searchQuery: "",
        currentPage: 1,
        pageSize: 24,
        sortBy: { path: "order_id", order: "asc" },
    };

    async componentDidMount() {
        let orders = null;
        const { role, user_id } = await getCurrentUser();
        this.setState({ userType: role });
        if (role === "admin") {
            orders = (await getOrders()).data;
        } else if (role === "customer") {
            orders = (await getCustomerOrders(user_id)).data;
        }
        this.setState({ orders });
        this.setState({ loading: false });
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

    handlePageChange = (page) => {
        this.setState({ currentPage: page });
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
                const queryRegEx = new RegExp(`.*${searchQuery}.*`);
                return queryRegEx.test(title);
            });

        const sorted = _.orderBy(
            filtered,
            (order) => {
                return order[sortBy.path];
            },
            [sortBy.order]
        );

        const orders = paginate(sorted, currentPage, pageSize);
        return { totalCount: sorted.length, data: orders };
    };

    render() {
        const { searchQuery, pageSize, currentPage, userType } = this.state;
        const { totalCount, data: orders } = this.getPagedData();
        return (
            <div className="container-fluid mb-5">
                <div className="row">
                    <div className="container w-75 mb-5">
                        <div className="p-3 div-dark">
                            <SearchBox
                                value={searchQuery}
                                onChange={this.handleSearch}
                                placeholder={"Enter order ID"}
                            />
                        </div>
                    </div>

                    <OrdersTable
                        userType={userType}
                        orders={orders}
                        sortBy={this.state.sortBy}
                        onSort={this.handleSort}
                        loading={this.state.loading}
                        searchQuery={this.state.searchQuery}
                    />
                    <Pagination
                        itemsCount={totalCount}
                        pageSize={pageSize}
                        currentPage={currentPage}
                        onPageChange={this.handlePageChange}
                    />
                </div>
            </div>
        );
    }
}

export default Orders;
