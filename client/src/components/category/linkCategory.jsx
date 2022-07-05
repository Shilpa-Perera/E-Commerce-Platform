import React, { Component } from "react";
import {
    getCategories,
    getSubCategoriesToLink,
    linkSubCategories,
} from "../../services/categoryService";
import CategoryList from "../products/categoryList";
import SubCategoryList from "../products/subCategoryList";
import { toast } from "react-toastify";

class CategoryLink extends Component {
    state = {
        categories: [],
        subCategories: [],
        category_id: null,
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
            category_id: category.category_id,
            subCategories: subCategories,
            selectedSubCategory: null,
        });
    };

    handleSubCategorySelect = async (subCategory) => {
        await linkSubCategories(
            this.state.category_id,
            subCategory.sub_category_id
        );

        const { data: subCategories } = await getSubCategoriesToLink(
            this.state.category_id
        );

        this.setState({
            subCategories: subCategories,
        });

        toast.success("Link SubCategory Successfully.", {
            theme: "dark",
        });
    };

    handleClearCategorySelection = () => {
        this.setState({ selectedCategory: null, selectedSubCategory: null });
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
                            handleClearSelection={
                                this.handleClearCategorySelection
                            }
                        />
                    </div>
                    <div className="col-md-8 col-lg-9 col-xxl-10">
                        {selectedCategory && subCategories && (
                            <div>
                                <h1 className="d-inline-block text-muted pb-5">
                                    Click Sub Categories to Link
                                </h1>
                                <SubCategoryList
                                    subCategories={subCategories}
                                    handleSubCategorySelect={
                                        this.handleSubCategorySelect
                                    }
                                    selectedSubCategory={selectedSubCategory}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default CategoryLink;
