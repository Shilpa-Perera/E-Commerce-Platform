import React from "react";
import ListGroup from "../common/listGroup";

export default function SubCategoryList({
    subCategories,
    handleSubCategorySelect,
    selectedSubCategory,
    handleClearSelection,
}) {
    return (
        <div className="pb-5">
            <div className="container">
                <div className="mb-3 d-flex justify-content-between">
                    <div>
                        <h2 className="d-inline-block">Sub Categories</h2>
                        {selectedSubCategory && (
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
                        data-bs-target="#sub-category-collapse"
                        aria-controls="sub-category-collapse"
                        aria-expanded="false"
                        aria-label="Toggle subcategory"
                    >
                        <span className="navbar-light">
                            <i className="fa fa-bars"></i>
                        </span>
                    </button>
                </div>
                <div id="sub-category-collapse" className="collapse d-md-block">
                    <ListGroup
                        items={subCategories}
                        onItemSelect={handleSubCategorySelect}
                        selectedItem={selectedSubCategory}
                        textProperty={"sub_category_name"}
                        valueProperty={"sub_category_id"}
                        additionalClasses={"flex-column flex-sm-row"}
                        additionalItemClasses={"border-0 rounded-pill mb-2 me-2"}
                    />
                </div>
            </div>
        </div>
    );
}
