import React from "react";
import ListGroup from "./common/listGroup";

export default function SubCategoryList({
    subCategories,
    handleSubCategorySelect,
    selectedSubCategory,
    handleClearSelection,
}) {
    return (
        <div className="pb-5">
            <div className="container">
                <div className="mb-3">
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
                <ListGroup
                    items={subCategories}
                    onItemSelect={handleSubCategorySelect}
                    selectedItem={selectedSubCategory}
                    textProperty={"sub_category_name"}
                    valueProperty={"sub_category_id"}
                    additionalClasses={"flex-column flex-sm-row"}
                    additionalItemClasses={"border-0 rounded-pill"}
                />
            </div>
        </div>
    );
}
