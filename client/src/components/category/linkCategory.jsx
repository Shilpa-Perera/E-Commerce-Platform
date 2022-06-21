import React, { Component } from "react";
import {
    getCategories,
    getSubCategoriesToLink,
} from "../../services/categoryService";
import CategoryList from "../products/categoryList";
import SubCategoryList from "../products/subCategoryList";

class CategoryLink extends Component {
    state = {
        categories: [],
        subCategories: [],
        selectedCategory: null,
        selectedSubCategory: null,
    };

    async componentDidMount() {
        const { data: categories } = await getCategories();
        this.setState({ categories });
    }

    handleCategorySelect = async (category) => {
        const { data: subCategories } = await getSubCategoriesToLink(
            category.category_id
        );
        this.setState({
            selectedCategory: category,
            subCategories: subCategories,
            selectedSubCategory: null,
        });
    };

    handleSubCategorySelect = (subCategory) => {
        this.setState({
            selectedSubCategory: subCategory,
        });
    };

    render() {
        const { user } = this.props;
        const {
            categories,
            selectedCategory,
            subCategories,
            selectedSubCategory,
        } = this.state;
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
                            // handleClearSelection={
                            //     this.handleClearCategorySelection
                            // }
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
                                // handleClearSelection={
                                //     this.handleClearSubCategorySelection
                                // }
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default CategoryLink;
