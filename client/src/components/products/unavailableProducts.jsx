import React, { Component } from "react";
import {
    getUnavailableProducts,
    restoreProduct,
} from "../../services/productService";
import _ from "lodash";
import { paginate } from "../../utils/paginate";
import UnavailableProductsTable from "./unavailableProductsTable";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SearchBox from "../common/searchBox";

class UnavailableProductsBody extends Component {
    state = {
        unavailableProducts: null,
        currentPage: 1,
        pageSize: 24,
        searchQuery: "",
        sortBy: { path: "product_title", order: "asc" },
    };

    getPagedData = () => {
        const {
            unavailableProducts,
            sortBy,
            currentPage,
            pageSize,
            searchQuery,
        } = this.state;

        let filtered = unavailableProducts;
        if (searchQuery)
            filtered = unavailableProducts.filter((p) => {
                const title = p.product_title.toLowerCase();
                const queryRegEx = new RegExp(
                    `.*${searchQuery.toLowerCase()}.*`
                );
                return queryRegEx.test(title);
            });

        const sorted = _.orderBy(filtered, (product) => product[sortBy.path], [
            sortBy.order,
        ]);

        const products = paginate(sorted, currentPage, pageSize);

        return { totalCount: filtered.length, data: products };
    };

    async componentDidMount() {
        try {
            const { data: unavailableProducts } =
                await getUnavailableProducts();

            for (const product of unavailableProducts) {
                const { availability, default_variant_id } = product;
                if (availability === "UNAVAILABLE") product.reason = "Deleted";
                else if (
                    availability === "AVAILABLE" &&
                    default_variant_id === null
                )
                    product.reason = "No default variant";
                else product.reason = "Unknown";
            }

            this.setState({ unavailableProducts });
        } catch (e) {}
    }

    handleSort = (sortBy) => {
        if (sortBy.path) this.setState({ sortBy });
    };

    handleRestore = async (productId) => {
        const unavailableProducts = [...this.state.unavailableProducts];
        const originalProducts = [...unavailableProducts];

        for (let i = 0; i < unavailableProducts.length; ++i) {
            if (unavailableProducts[i].product_id === productId) {
                unavailableProducts.splice(i, 1);
                break;
            }
        }
        this.setState({ unavailableProducts });

        try {
            await restoreProduct(productId);
            this.props.push(`/products/${productId}/variants`);
        } catch (e) {
            toast.error("Could not restore the product", { theme: "dark" });
            this.setState({ unavailableProducts: originalProducts });
        }
    };

    handleSearch = (searchQuery) => {
        this.setState({
            searchQuery,
            currentPage: 1,
        });
    };

    render() {
        const { unavailableProducts: data, sortBy, searchQuery } = this.state;
        if (data === null) return;

        const { length: count } = data;
        if (count === 0)
            return (
                <div className="container-fluid mb-5 mt-5">
                    <div className="d-flex justify-content-center align-items-center">
                        <p className="h4">There are no unavailable products.</p>
                    </div>
                </div>
            );

        const { totalCount, data: products } = this.getPagedData();

        return (
            <div className="container">
                <div className="p-4">
                    <h1>Unavailable Products</h1>
                </div>
                <div className="container w-75 mb-5 mt-3">
                    <div className="p-3 div-dark">
                        <SearchBox
                            value={searchQuery}
                            onChange={this.handleSearch}
                        />
                    </div>
                </div>
                <div className="mt-5 div-dark">
                    <div className="row row-cols-1">
                        {totalCount === 0 && (
                            <h4 className="text-invert">
                                There are no product available.
                            </h4>
                        )}
                        {totalCount > 0 && (
                            <UnavailableProductsTable
                                products={products}
                                sortBy={sortBy}
                                onSort={this.handleSort}
                                onRestore={this.handleRestore}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

function UnavailableProducts(props) {
    const push = useNavigate();
    return <UnavailableProductsBody {...{ ...props, push }} />;
}

export default UnavailableProducts;
