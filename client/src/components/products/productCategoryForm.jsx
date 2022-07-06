import React, { Component } from "react";
import Select from "../common/select";
import { getSubCategories } from "../../services/categoryService";
import { Link } from "react-router-dom";

class ProductCategoryForm extends Component {
    state = {
        selectedCategory: 0,
        selectedSubCategory: 0,
        noSubCategory: false,
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
            if (data) {
                for (const category of data) {
                    subCategories.push({
                        id: category.sub_category_id,
                        name: category.sub_category_name,
                    });
                }
            }
        } else {
            categoryErr = "Please select a category";
        }

        this.setState({
            selectedCategory,
            categoryErr,
            subCategories,
            noSubCategory: false,
            subCategoryLoading: false,
        });
    };

    handleNoSubcategory = () => {
        this.setState({ noSubCategory: true });
    };

    handleSubCategoryChange = ({ currentTarget: input }) => {
        const selectedSubCategory = parseInt(input.value);
        let subCategoryErr = null;

        if (selectedSubCategory === 0) subCategoryErr = "Select a subcategory";

        this.setState({ selectedSubCategory, subCategoryErr });
    };

    handleSubmit = (e) => {
        e.preventDefault();

        const {
            selectedCategory,
            selectedSubCategory,
            subCategories,
            noSubCategory,
        } = this.state;
        let errCnt = 0;

        if (selectedCategory > 0) {
            this.setState({ categoryErr: null });
        } else {
            this.setState({ categoryErr: "Select a category." });
            ++errCnt;
        }

        if (noSubCategory || selectedSubCategory > 0) {
            this.setState({ subCategoryErr: null });
        } else {
            this.setState({ subCategoryErr: "Select a subcategory." });
            ++errCnt;
        }

        const subCategoryId = noSubCategory ? null : selectedSubCategory;
        const subCategoryName = noSubCategory
            ? null
            : subCategories.find(
                  (subcategory) => subcategory.id === selectedSubCategory
              ).name;

        if (errCnt === 0) {
            this.props.onSubmit({
                category_id: selectedCategory,
                sub_category_id: subCategoryId,
                category_name: this.props.categories.find(
                    (category) => category.id === selectedCategory
                ).name,
                sub_category_name: subCategoryName,
            });
            this.setState({
                selectedCategory: 0,
                selectedSubCategory: 0,
                subCategories: [],
                noSubCategory: false,
            });
        }
    };

    render() {
        const {
            selectedCategory,
            selectedSubCategory,
            noSubCategory,
            subCategoryLoading,
            subCategories,
            categoryErr,
            subCategoryErr,
        } = this.state;
        const { categories } = this.props;

        const subCategoryAvailable = subCategories.length > 0;

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
                            {!subCategoryLoading &&
                                !noSubCategory &&
                                subCategoryAvailable && (
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
                            {!subCategoryLoading &&
                                !noSubCategory &&
                                !subCategoryAvailable && (
                                    <div className="mb-3">
                                        <div className="alert alert-warning">
                                            <i className="fa fa-warning"></i>
                                            <span className="mx-2">
                                                No subcategories linked to this
                                                category.
                                            </span>
                                            <Link
                                                to="/categories/link-category"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <span className="btn btn-sm btn-primary">
                                                    <span className="me-2">
                                                        Link
                                                    </span>
                                                    <i className="fa fa-external-link"></i>
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            {!noSubCategory && (
                                <div className="mb-2">
                                    <span
                                        className="btn btn-warning me-2 mb-2"
                                        onClick={this.handleNoSubcategory}
                                    >
                                        <span className="me-2">
                                            No Subcategory
                                        </span>
                                        <i className="fa fa-question"></i>
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                    <button
                        disabled={
                            selectedCategory === 0 ||
                            (!noSubCategory && selectedSubCategory === 0)
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
