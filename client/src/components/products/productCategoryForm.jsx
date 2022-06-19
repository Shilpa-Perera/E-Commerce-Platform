import React, { Component } from "react";
import Select from "../common/select";
import { getSubCategories } from "../../services/categoryService";

class ProductCategoryForm extends Component {
    state = {
        selectedCategory: 0,
        selectedSubCategory: 0,
        subCategories: [],
        subCategoryLoading: false,
        categoryErr: null,
        subCategoryErr: null,
    };

    handleCategoryChange = async ({ currentTarget: input }) => {
        this.setState({ subCategoryLoading: true });

        const selectedCategory = parseInt(input.value);
        let categoryErr = null;

        let subCategories = [];
        if (selectedCategory > 0) {
            const { data } = await getSubCategories(selectedCategory);
            for (const category of data) {
                subCategories.push({
                    id: category.sub_category_id,
                    name: category.sub_category_name,
                });
            }
        } else {
            categoryErr = "Please select a category";
        }

        this.setState({
            selectedCategory,
            categoryErr,
            subCategories,
            subCategoryLoading: false,
        });
    };

    handleSubCategoryChange = ({ currentTarget: input }) => {
        const selectedSubCategory = parseInt(input.value);
        let subCategoryErr = null;

        if (selectedSubCategory === 0) subCategoryErr = "Select a subcategory";

        this.setState({ selectedSubCategory, subCategoryErr });
    };

    handleSubmit = (e) => {
        e.preventDefault();

        const { selectedCategory, selectedSubCategory, subCategories } =
            this.state;
        let errCnt = 0;

        if (selectedCategory > 0) {
            this.setState({ categoryErr: null });
        } else {
            this.setState({ categoryErr: "Select a category." });
            ++errCnt;
        }

        if (selectedSubCategory > 0) {
            this.setState({ subCategoryErr: null });
        } else {
            this.setState({ subCategoryErr: "Select a subcategory." });
            ++errCnt;
        }

        if (errCnt === 0) {
            this.props.onSubmit({
                category_id: selectedCategory,
                sub_category_id: selectedSubCategory,
                category_name: this.props.categories.find(
                    (category) => category.id === selectedCategory
                ).name,
                sub_category_name: subCategories.find(
                    (subcategory) => subcategory.id === selectedSubCategory
                ).name,
            });
            this.setState({
                selectedCategory: 0,
                selectedSubCategory: 0,
                subCategories: [],
            });
        }
    };

    render() {
        const {
            selectedCategory,
            selectedSubCategory,
            subCategoryLoading,
            subCategories,
            categoryErr,
            subCategoryErr,
        } = this.state;
        const { categories } = this.props;

        return (
            <div>
                <h4 className="text-success">Add Category</h4>
                <form onSubmit={this.handleSubmit}>
                    <div className="input-group d-block">
                        <Select
                            name={"category_id"}
                            value={selectedCategory}
                            label={"Category"}
                            error={categoryErr}
                            options={[{ id: 0, value: "" }, ...categories]}
                            onChange={this.handleCategoryChange}
                        />
                    </div>
                    {selectedCategory > 0 && (
                        <div className="input-group d-block">
                            {subCategoryLoading && (
                                <div
                                    className="spinner-border text-primary"
                                    role="status"
                                >
                                    <span className="visually-hidden">
                                        Loading...
                                    </span>
                                </div>
                            )}
                            {!subCategoryLoading && (
                                <Select
                                    name={"sub_category_id"}
                                    value={selectedSubCategory}
                                    label={"Subcategory"}
                                    error={subCategoryErr}
                                    options={[
                                        { id: 0, value: "" },
                                        ...subCategories,
                                    ]}
                                    onChange={this.handleSubCategoryChange}
                                />
                            )}
                        </div>
                    )}
                    <button
                        disabled={
                            selectedCategory === 0 || selectedSubCategory === 0
                        }
                        className={`btn btn-primary hover-focus`}
                    >
                        <span className="me-2">Add Category</span>
                        <i className="fa fa-plus-circle"></i>
                    </button>
                </form>
            </div>
        );
    }
}

export default ProductCategoryForm;
