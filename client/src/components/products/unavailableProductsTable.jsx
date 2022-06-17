import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "../common/table";

class ProductsTable extends Component {
    columns = [
        { path: "product_title", label: "Product Title" },
        { path: "category_name", label: "Category" },
        { path: "sub_category_name", label: "Subcategory" },
        { path: "sku", label: "SKU" },
        {
            path: "reason",
            label: "Reason",
        },
        {
            key: "Actions",
            content: ({ product_id, availability, default_variant_id }) => (
                <div className="d-flex flex-column flex-lg-row mb-3">
                    {availability === "UNAVAILABLE" && (
                        <span className="me-2 my-2 my-lg-0">
                            <button
                                className="btn btn-success btn-sm hover-focus"
                                onClick={() => this.props.onRestore(product_id)}
                            >
                                <span className="me-2">Restore</span>
                                <i className="fa fa-undo"></i>
                            </button>
                        </span>
                    )}
                    {availability === "AVAILABLE" &&
                        default_variant_id === null && (
                            <span className="me-2 my-2 my-lg-0">
                                <Link to={`/products/${product_id}/variants/`}>
                                    <button className="btn btn-primary btn-sm hover-focus">
                                        <span className="me-2">
                                            Manage Variants
                                        </span>
                                        <i className="fa fa-gears"></i>
                                    </button>
                                </Link>
                            </span>
                        )}
                </div>
            ),
            label: "Actions",
        },
    ];

    render() {
        const { products, sortBy, onSort } = this.props;

        return (
            <div className="col">
                <Table
                    columns={this.columns}
                    data={products}
                    sortColumn={sortBy}
                    onSort={onSort}
                />
            </div>
        );
    }
}

export default ProductsTable;
