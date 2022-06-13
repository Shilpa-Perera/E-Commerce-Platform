import React, { Component } from "react";
import _ from "lodash";
import { getProducts } from "../../services/productService";
import ProductAlbum from "./productAlbum";
import { getCategories, getSubCategories } from "../../services/categoryService";
import CategoryList from "./categoryList";
import SubCategoryList from "./subCategoryList";
import SearchBox from "../common/searchBox";
import { paginate } from "../../utils/paginate";
import Pagination from "../common/pagination";
import ProductsTable from "./productsTable";

class Products extends Component {
    state = {
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
        const { data: products } = await getProducts();
        const { data: categories } = await getCategories();
        this.setState({ products, categories });
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
            filtered = allProducts.filter(
                (p) =>
                    p.sub_category_id === selectedSubCategory.sub_category_id &&
                    p.category_id === selectedCategory.category_id
            );
        } else if (selectedCategory && selectedCategory.category_id) {
            filtered = allProducts.filter(
                (p) => p.category_id === selectedCategory.category_id
            );
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
        const { isAlbum, isTable } = this.props;
        const { length: count } = this.state.products;
        if (count === 0)
            return (
                <div className="container-fluid mb-5">
                    <p className="h4">There are no products in the database</p>
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

        return (
            <div className="container-fluid mb-5">
                <div className="row">
                    <div className="col-md-4 col-lg-3 col-xxl-2">
                        <CategoryList
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
