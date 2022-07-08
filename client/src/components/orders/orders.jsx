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
        filterBy: null,
        filterBy2: null,
        totalOrdersCount: null,
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
            filterBy,
            filterBy2,
        } = this.state;

        let filtered = allOrders;
        if (searchQuery)
            filtered = allOrders.filter((p) => {
                const title = p.order_id;
                const queryRegEx = new RegExp(`.*${searchQuery}.*`);
                return queryRegEx.test(title);
            });
        if (filterBy) {
            filtered = filtered.filter((ele) => {
                return ele.payment_state === filterBy;
            });
        }
        if (filterBy2) {
            filtered = filtered.filter((ele) => {
                return ele.delivery_state === filterBy2;
            });
        }
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

    setFilter = (event) => {
        const filtertype = event.target.value;

        if (filtertype === "") {
            this.setState({ filterBy: null });
            return;
        }
        this.setState({ filterBy: filtertype, currentPage: 1 });
        this.getPagedData();
    };
    setFilter2 = (event) => {
        const filtertype = event.target.value;
        if (filtertype === "") {
            this.setState({ filterBy2: null });
            return;
        }
        this.setState({ filterBy2: filtertype, currentPage: 1 });
        this.getPagedData();
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
                    <Pagination
                        itemsCount={totalCount}
                        pageSize={pageSize}
                        currentPage={currentPage}
                        onPageChange={this.handlePageChange}
                    />
                    {userType !== null ? (
                        <OrdersTable
                            userType={userType}
                            orders={orders}
                            sortBy={this.state.sortBy}
                            onSort={this.handleSort}
                            loading={this.state.loading}
                            searchQuery={this.state.searchQuery}
                            filterOnClick={this.setFilter}
                            filterOnClickDelivery={this.setFilter2}
                            totalOrdersCount={totalCount}
                        />
                    ) : (
                        Loading()
                    )}

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
