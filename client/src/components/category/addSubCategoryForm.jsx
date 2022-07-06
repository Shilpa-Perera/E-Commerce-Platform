import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import {
    addSubCategory,
    getAllSubCategories,
} from "../../services/categoryService";

class AddSubCategoryForm extends Form {
    state = {
        subCategories: [],
        data: { new_sub_category_name: "" },
        errors: [],
    };

    schema = {
        new_sub_category_name: Joi.string()
            .required()
            .min(3)
            .max(50)
            .label("New Sub Category Name"),
    };

    async componentDidMount() {
        const { data: subCategories } = await getAllSubCategories();
        this.setState({ subCategories });
    }

    checkSubCategoryExists = (new_sub_category_name) => {
        for (let subCategory in this.state.subCategories) {
            if (
                subCategory.toLowerCase() ===
                new_sub_category_name.toLowerCase()
            ) {
                return true;
            }
        }
        return false;
    };

    doSubmit = async () => {
        if (
            !this.checkSubCategoryExists(this.state.data.new_sub_category_name)
        ) {
            await addSubCategory(this.state.data.new_sub_category_name);

            document.getElementById("new_sub_category_name").value = "";

            const state = {
                data: { new_sub_category_name: "" },
                errors: [],
            };
            this.setState(state);
        } else {
            const errors = { ...this.state.errors };
            errors["adding_error"] = "Sub Category Already Exists";
            this.setState({ errors });
        }
    };

    render() {
        const adding_error = this.state.errors["adding_error"];
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput(
                        "new_sub_category_name",
                        "New Sub Category Name"
                    )}
                    {adding_error && (
                        <div className="alert alert-danger">{adding_error}</div>
                    )}
                    {this.renderStyledButton(
                        "Add New Sub Category",
                        "hover-focus",
                        () => (
                            <i className="fa fa-plus-circle"></i>
                        )
                    )}
                </form>
            </div>
        );
    }
}

export default AddSubCategoryForm;
