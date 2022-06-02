import React, { useEffect, useState } from "react";
import ListGroup from "./common/listGroup";
import { Collapse } from "bootstrap";

export default function SubCategoryList({
    subCategories,
    handleSubCategorySelect,
    selectedSubCategory,
    handleClearSelection,
}) {
    const [collapsed, setCollapse] = useState(true);

    useEffect(() => {
        const collapse = document.getElementById("sub-category-collapse");
        const bsCollapse = new Collapse(collapse, { toggle: false });
        if (collapsed) bsCollapse.hide();
        else bsCollapse.show();
    });

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
                        onClick={() => setCollapse(!collapsed)}
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
                        additionalItemClasses={"border-0 rounded-pill"}
                    />
                </div>
            </div>
        </div>
    );
}
