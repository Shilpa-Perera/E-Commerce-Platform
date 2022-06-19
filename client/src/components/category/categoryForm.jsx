import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import AddCategoryForm from "./addCategoryForm";
import AddSubCategoryForm from "./addSubCategoryForm";

class CategoryForm extends Form {
    render() {
        return (
            <div>
                <div className="container mb-5">
                    <div className="p-4">
                        <h1>New Category</h1>
                    </div>
                    <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2 p-5 div-dark">
                        <div className="col mb-3">{<AddCategoryForm />}</div>
                    </div>
                </div>
                <div className="container mb-5">
                    <div className="p-4">
                        <h1>New Sub Category</h1>
                    </div>
                    <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2 p-5 div-dark">
                        <div className="col mb-3">{<AddSubCategoryForm />}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CategoryForm;
