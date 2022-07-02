import React, { Component } from "react";
import _ from "lodash";
import { deleteProduct, getProducts } from "../../services/productService";
import ProductAlbum from "./productAlbum";
import {
    getCategories,
    getSubCategories,
} from "../../services/categoryService";
import CategoryList from "./categoryList";
import SubCategoryList from "./subCategoryList";
import SearchBox from "../common/searchBox";
import { paginate } from "../../utils/paginate";
import Pagination from "../common/pagination";
import ProductsTable from "./productsTable";
import { toast } from "react-toastify";
import Loading from "../common/loading";
import ProductInterestTable from "../reports/productInterestReport/productInterestTable";

class Products extends Component {
    state = {
        loading: true,
        products: [],
        categories: [],
        subCategories: [],
        selectedCategory: null,
        selectedSubCategory: null,
        searchQuery: "",
        currentPage: 1,
        pageSize: 24,
        sortBy: { path: "product_title", order: "asc" },
    };

    sortOptions = [
        { id: "product_title", name: "Product" },
        { id: "price", name: "Price" },
    ];

    orderOptions = [
        { id: "asc", name: "Ascending" },
        { id: "desc", name: "Descending" },
    ];

    async componentDidMount() {
        try {
            const { data: products } = await getProducts();
            const { data: categories } = await getCategories();
            this.setState({ products, categories, loading: false });
        } catch (e) {
            this.setState({ loading: false });
        }
    }

    handleCategorySelect = async (category) => {
        const { data: subCategories } = await getSubCategories(
            category.category_id
        );
        this.setState({
            selectedCategory: category,
            subCategories: subCategories,
            selectedSubCategory: null,
            currentPage: 1,
            searchQuery: "",
        });
    };

    handleSubCategorySelect = (subCategory) => {
        this.setState({
            selectedSubCategory: subCategory,
            currentPage: 1,
            searchQuery: "",
        });
    };

    handleSearch = (searchQuery) => {
        this.setState({
            searchQuery,
            selectedCategory: null,
            selectedSubCategory: null,
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

    handlePageChange = (page) => {
        this.setState({ currentPage: page });
    };

    handleClearCategorySelection = () => {
        this.setState({ selectedCategory: null, selectedSubCategory: null });
    };

    handleClearSubCategorySelection = () => {
        this.setState({ selectedSubCategory: null });
    };

    handleDeleteProduct = async (productId) => {
        const products = [...this.state.products];
        const originalProducts = [...products];

        for (let i = 0; i < products.length; ++i) {
            if (products[i].product_id === productId) {
                products.splice(i, 1);
                break;
            }
        }
        this.setState({ products });

        try {
            await deleteProduct(productId);
        } catch (e) {
            toast.error("Could not delete the product", { theme: "dark" });
            this.setState({ products: originalProducts });
        }
    };

    getPagedData = () => {
        const {
            products: allProducts,
            selectedCategory,
            selectedSubCategory,
            sortBy,
            currentPage,
            pageSize,
            searchQuery,
        } = this.state;

        let filtered = allProducts;
        if (searchQuery)
            filtered = allProducts.filter((p) => {
                const title = p.product_title.toLowerCase();
                const queryRegEx = new RegExp(
                    `.*${searchQuery.toLowerCase()}.*`
                );
                return queryRegEx.test(title);
            });
        else if (selectedSubCategory && selectedSubCategory.sub_category_id) {
            filtered = allProducts.filter((p) => {
                for (const {
                    category_id,
                    sub_category_id,
                } of p.product_categories) {
                    if (
                        category_id === selectedCategory.category_id &&
                        sub_category_id === selectedSubCategory.sub_category_id
                    )
                        return true;
                }
                return false;
            });
        } else if (selectedCategory && selectedCategory.category_id) {
            filtered = allProducts.filter((p) => {
                for (const { category_id } of p.product_categories) {
                    if (category_id === selectedCategory.category_id)
                        return true;
                }
                return false;
            });
        }

        const sorted = _.orderBy(
            filtered,
            (product) => {
                if (sortBy.path === "price") {
                    return +product.price;
                } else if (sortBy.path === "quantity") {
                    return +product.quantity;
                }
                return product[sortBy.path];
            },
            [sortBy.order]
        );

        const products = paginate(sorted, currentPage, pageSize);

        return { totalCount: filtered.length, data: products };
    };

    render() {
        if (this.state.loading) return <Loading />;

        const { isAlbum, isTable, isReport, user } = this.props;
        const { length: count } = this.state.products;
        if (count === 0)
            return (
                <div className="container-fluid mb-5 mt-5">
                    <div className="d-flex justify-content-center align-items-center">
                        <p className="h4">There are no available products.</p>
                    </div>
                </div>
            );

        const {
            categories,
            selectedCategory,
            subCategories,
            selectedSubCategory,
            currentPage,
            pageSize,
            searchQuery,
        } = this.state;

        const { totalCount, data: products } = this.getPagedData();

        const isAdmin = user && user.role === "admin";

        return (
            <div className="container-fluid mb-5">
                <div className="row">
                    <div className="col-md-4 col-lg-3 col-xxl-2">
                        <CategoryList
                            isAdmin={isAdmin}
                            categories={categories}
                            handleCategorySelect={this.handleCategorySelect}
                            selectedCategory={selectedCategory}
                            handleClearSelection={
                                this.handleClearCategorySelection
                            }
                        />
                    </div>
                    <div className="col-md-8 col-lg-9 col-xxl-10">
                        <div className="container w-75 mb-5">
                            <div className="p-3 div-dark">
                                <SearchBox
                                    value={searchQuery}
                                    onChange={this.handleSearch}
                                />
                            </div>
                        </div>
                        {selectedCategory && subCategories && (
                            <SubCategoryList
                                subCategories={subCategories}
                                handleSubCategorySelect={
                                    this.handleSubCategorySelect
                                }
                                selectedSubCategory={selectedSubCategory}
                                handleClearSelection={
                                    this.handleClearSubCategorySelection
                                }
                            />
                        )}
                        {isAlbum && (
                            <ProductAlbum
                                isAdmin={isAdmin}
                                products={products}
                                sortBy={this.state.sortBy}
                                sortOptions={this.sortOptions}
                                onSortClick={this.handleSortClick}
                                orderOptions={this.orderOptions}
                                onOptionClick={this.handleOptionClick}
                            />
                        )}
                        {isTable && (
                            <ProductsTable
                                products={products}
                                sortBy={this.state.sortBy}
                                onSort={this.handleSort}
                                deleteProduct={this.handleDeleteProduct}
                            />
                        )}
                        {isReport && (
                            <ProductInterestTable
                                products={products}
                                sortBy={this.state.sortBy}
                                onSort={this.handleSort}
                            />
                        )}
                        <Pagination
                            itemsCount={totalCount}
                            pageSize={pageSize}
                            currentPage={currentPage}
                            onPageChange={this.handlePageChange}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Products;
