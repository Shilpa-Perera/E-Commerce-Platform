import React from "react";
import ListGroup from "./common/listGroup";

export default function SubCategoryList({
    subCategories,
    handleSubCategorySelect,
    selectedSubCategory,
}) {
    return (
        <div className="pb-5">
            <div className="container">
                <h2 className="mb-3">Sub Categories</h2>
                <ListGroup
                    items={subCategories}
                    onItemSelect={handleSubCategorySelect}
                    selectedItem={selectedSubCategory}
                    textProperty={"subcategory_name"}
                    valueProperty={"subcategory_id"}
                    additionalClasses={"flex-column flex-sm-row"}
                    additionalItemClasses={"border-0 rounded-pill"}
                />
            </div>
        </div>
    );
}
