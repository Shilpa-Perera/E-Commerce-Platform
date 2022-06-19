import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { addCategory } from "../../services/categoryService";

class AddCategoryForm extends Form {
    state = {
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

    doSubmit = async () => {
        await addCategory(this.state.data.new_category_name);

        document.getElementById("new_category_name").value = "";

        const state = {
            data: { new_category_name: "" },
            errors: [],
        };
        this.setState(state);
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput("new_category_name", "New Category Name")}
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
