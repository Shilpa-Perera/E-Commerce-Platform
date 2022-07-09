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
        filterBy3: null,
        filterBy4: null,
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
            filterBy3,
            filterBy4,
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
        if (filterBy3) {
            filtered = filtered.filter((ele) => {
                return ele.payment_method === filterBy3;
            });
        }
        if (filterBy4) {
            filtered = filtered.filter((ele) => {
                return ele.delivery_method === filterBy4;
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

    // Payment State
    setFilter = (event) => {
        const filtertype = event.target.value;

        if (filtertype === "") {
            this.setState({ filterBy: null });
            return;
        }
        this.setState({ filterBy: filtertype, currentPage: 1 });
        this.getPagedData();
    };

    // Delivery State
    setFilter2 = (event) => {
        const filtertype = event.target.value;
        if (filtertype === "") {
            this.setState({ filterBy2: null });
            return;
        }
        this.setState({ filterBy2: filtertype, currentPage: 1 });
        this.getPagedData();
    };

    // Payment Method
    setFilter3 = (event) => {
        const filtertype = event.target.value;
        if (filtertype === "") {
            this.setState({ filterBy3: null });
            return;
        }
        this.setState({ filterBy3: filtertype, currentPage: 1 });
        this.getPagedData();
    };

    // Delivery Method
    setFilter4 = (event) => {
        const filtertype = event.target.value;
        if (filtertype === "") {
            this.setState({ filterBy4: null });
            return;
        }
        this.setState({ filterBy4: filtertype, currentPage: 1 });
        this.getPagedData();
    };
    resetFilter = (event) => {
        this.setState({
            filterBy: null,
            filterBy2: null,
            filterBy3: null,
            filterBy4: null,
        });
        let element1 = document.getElementById("filterSelect1");
        element1.value = "";
        let element2 = document.getElementById("filterSelect2");
        element2.value = "";
        let element3 = document.getElementById("filterSelect3");
        element3.value = "";
        let element4 = document.getElementById("filterSelect4");
        element4.value = "";
        return this.getPagedData();
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
                            filterOnClickPaymentMethod={this.setFilter3}
                            filterOnClickDeliveryMethod={this.setFilter4}
                            resetFilter={this.resetFilter}
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
