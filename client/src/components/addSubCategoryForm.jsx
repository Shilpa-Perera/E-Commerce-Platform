import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";

class AddSubCategoryForm extends Form {
  state = {
    new_sub_category_name: "",
    errors: [],
  };

  schema = {
    new_sub_category_name: Joi.string()
      .required()
      .min(3)
      .max(50)
      .label("New Sub Category Name"),
  };

  doSubmit = async () => {
    this.props.addSubCategory(this.state.new_sub_category_name);

    document.getElementById("new_sub_category_name").value = "";

    const state = {
      new_sub_category_name: "",
      errors: [],
    };
    this.setState(state);
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          {/* {this.renderInput("new_sub_category_name", "New Sub Category Name")} */}
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
