import React, { Component } from "react";
import { getProducts } from "../services/productService";
import ProductAlbum from "./productAlbum";
import { getCategories, getSubCategories } from "../services/categoryService";
import CategoryList from "./categoryList";
import SubCategoryList from "./subCategoryList";

class Products extends Component {
    state = {
        products: [],
        categories: [],
        subCategories: [],
        selectedCategory: null,
        selectedSubCategory: null,
    };

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
            // currentPage: 1,
            // searchQuery: "",
        });
    };

    handleSubCategorySelect = (subCategory) => {
        this.setState({
            selectedSubCategory: subCategory,
            // currentPage: 1,
            // searchQuery: "",
        });
    };

    render() {
        const {
            products,
            categories,
            selectedCategory,
            subCategories,
            selectedSubCategory,
        } = this.state;
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-4 col-lg-3 col-xxl-2">
                        <CategoryList
                            categories={categories}
                            handleCategorySelect={this.handleCategorySelect}
                            selectedCategory={selectedCategory}
                        />
                    </div>
                    <div className="col-md-8 col-lg-9 col-xxl-10">
                        {selectedCategory && subCategories && (
                            <SubCategoryList
                                subCategories={subCategories}
                                handleSubCategorySelect={
                                    this.handleSubCategorySelect
                                }
                                selectedSubCategory={selectedSubCategory}
                            />
                        )}
                        <ProductAlbum products={products} />
                    </div>
                </div>
            </div>
        );
    }
}

export default Products;
