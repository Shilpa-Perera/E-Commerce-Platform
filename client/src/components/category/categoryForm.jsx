import React from "react";
import Form from "../common/form";
import AddCategoryForm from "./addCategoryForm";
import AddSubCategoryForm from "./addSubCategoryForm";
import { Link } from "react-router-dom";

class CategoryForm extends Form {
    render() {
        return (
            <div>
                <div className="container">
                    <div className="d-grid d-md-flex justify-content-md-end">
                        <Link
                            className="btn btn-warning h5 hover-focus"
                            to="/categories/link-category"
                        >
                            <span className="ms-2">
                                Link Category and Sub Category
                            </span>
                        </Link>
                    </div>
                </div>
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
