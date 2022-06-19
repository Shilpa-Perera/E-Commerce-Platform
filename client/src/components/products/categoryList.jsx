import React from "react";
import ListGroup from "../common/listGroup";
import { Link } from "react-router-dom";

export default function CategoryList({
    isAdmin,
    categories,
    handleCategorySelect,
    selectedCategory,
    handleClearSelection,
}) {
    return (
        <div className="pb-5">
            <div className="container">
                <div className="mb-3 d-flex justify-content-between">
                    <div>
                        <h2 className="d-inline-block">Categories</h2>
                        {selectedCategory && (
                            <span
                                className="btn btn-outline-warning btn-sm rounded-pill ms-3 h5"
                                onClick={handleClearSelection}
                            >
                                Clear
                            </span>
                        )}
                    </div>
                    <button
                        className="btn btn-outline-dark d-md-none"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#category-collapse"
                        aria-controls="category-collapse"
                        aria-expanded="false"
                        aria-label="Toggle category"
                    >
                        <span className="navbar-light">
                            <i className="fa fa-bars"></i>
                        </span>
                    </button>
                </div>
                <div id="category-collapse" className="collapse d-md-block">
                    <ListGroup
                        items={categories}
                        onItemSelect={handleCategorySelect}
                        selectedItem={selectedCategory}
                        textProperty={"category_name"}
                        valueProperty={"category_id"}
                        additionalClasses={""}
                        additionalItemClasses={"border-0 rounded-pill mb-2"}
                    />
                    {isAdmin && (
                        <Link
                            className="btn btn-primary h5 mt-3 hover-focus"
                            to="/categories/new"
                        >
                            <i className="fa fa-plus"></i>
                            <span className="ms-2">Add New</span>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
