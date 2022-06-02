import React, { Component } from "react";
import OptionTable from "./optionTable";
import { Link } from "react-router-dom";
import Table from "./common/table";

class ProductsTable extends Component {
    columns = [
        { path: "product_title", label: "Product Title" },
        { path: "sku", label: "SKU" },
        { path: "product_weight", label: "Weight" },
        {
            key: "Actions",
            content: ({ product_id }) => (
                <div className="d-flex flex-column flex-lg-row mb-3">
                    <span className="me-2 my-2 my-lg-0">
                        <Link to={`products/${product_id}`}>
                            <button className="btn btn-success btn-sm hover-focus">
                                <span className="me-2">View Product</span>
                                <i className="fa fa-eye"></i>
                            </button>
                        </Link>
                    </span>
                    <span className="me-2 my-2 my-lg-0">
                        <Link to={`products/${product_id}`}>
                            <button className="btn btn-warning btn-sm hover-focus">
                                <span className="me-2">Edit Product</span>
                                <i className="fa fa-edit"></i>
                            </button>
                        </Link>
                    </span>
                    <span className="me-2 my-2 my-lg-0">
                        <Link to={`products/${product_id}`}>
                            <button className="btn btn-primary btn-sm hover-focus">
                                <span className="me-2">Manage Variants</span>
                                <i className="fa fa-edit"></i>
                            </button>
                        </Link>
                    </span>
                </div>
            ),
            label: "Actions",
        },
    ];

    render() {
        const { products, sortBy, onSort } = this.props;

        return (
            <div className="pb-5">
                <div className="container">
                    <h3 className="text-muted mb-4">Manage Products</h3>
                    <div className="my-5">
                        <Table
                            columns={this.columns}
                            data={products}
                            sortColumn={sortBy}
                            onSort={onSort}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default ProductsTable;
