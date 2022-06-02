import React, { useEffect, useState } from "react";
import ListGroup from "./common/listGroup";
import { Link } from "react-router-dom";
import { Collapse } from "bootstrap";

export default function CategoryList({
    categories,
    handleCategorySelect,
    selectedCategory,
    handleClearSelection,
}) {
    const [collapsed, setCollapse] = useState(true);

    useEffect(() => {
        const collapse = document.getElementById("category-collapse");
        const bsCollapse = new Collapse(collapse, { toggle: false });
        if (collapsed) bsCollapse.hide();
        else bsCollapse.show();
    });

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
                        onClick={() => setCollapse(!collapsed)}
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
                        additionalItemClasses={"border-0 rounded-pill my-sm-1"}
                    />
                    <Link
                        className="btn btn-primary h5 mt-3 hover-focus"
                        to="/categories/new"
                    >
                        <i className="fa fa-plus"></i>
                        <span className="ms-2">Add New</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
