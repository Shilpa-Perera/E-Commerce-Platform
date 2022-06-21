import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { addCategory, getCategories } from "../../services/categoryService";

class AddCategoryForm extends Form {
    state = {
        Categories: [],
        data: { new_category_name: "" },
        errors: [],
    };

    schema = {
        new_category_name: Joi.string()
            .required()
            .min(3)
            .max(50)
            .label("New Category Name"),
    };

    async componentDidMount() {
        const { data: categories } = await getCategories();
        this.setState({ categories });
    }

    checkCategoryExists = async (new_category_name) => {
        for (let category in this.state.Categories) {
            if (category.toLowerCase() === new_category_name.toLowerCase()) {
                return true;
            }
            return false;
        }
    };

    doSubmit = async () => {
        if (!this.checkCategoryExists(this.state.data.new_category_name)) {
            await addCategory(this.state.data.new_category_name);

            document.getElementById("new_category_name").value = "";

            const state = {
                data: { new_category_name: "" },
                errors: [],
            };
            this.setState(state);
        } else {
            const errors = { ...this.state.errors };
            errors["adding_error"] = "Category Already Exists";
            this.setState({ errors });
        }
    };

    render() {
        const adding_error = this.state.errors["adding_error"];
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput("new_category_name", "New Category Name")}
                    {adding_error && (
                        <div className="alert alert-danger">{adding_error}</div>
                    )}
                    {this.renderStyledButton(
                        "Add New Category",
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

export default AddCategoryForm;
