import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "../common/table";

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
                        <Link to={`/products/${product_id}/`}>
                            <button className="btn btn-success btn-sm hover-focus">
                                <span className="me-2">View Product</span>
                                <i className="fa fa-eye"></i>
                            </button>
                        </Link>
                    </span>
                    <span className="me-2 my-2 my-lg-0">
                        <Link to={`/products/edit/${product_id}/`}>
                            <button className="btn btn-warning btn-sm hover-focus">
                                <span className="me-2">Edit Product</span>
                                <i className="fa fa-edit"></i>
                            </button>
                        </Link>
                    </span>
                    <span className="me-2 my-2 my-lg-0">
                        <Link to={`/products/${product_id}/variants/`}>
                            <button className="btn btn-primary btn-sm hover-focus">
                                <span className="me-2">Manage Variants</span>
                                <i className="fa fa-gears"></i>
                            </button>
                        </Link>
                    </span>
                    <span className="me-2 my-2 my-lg-0">
                        <button
                            className="btn btn-danger btn-sm hover-focus"
                            onClick={() => this.props.deleteProduct(product_id)}
                        >
                            <span className="me-2">Delete Product</span>
                            <i className="fa fa-trash-o"></i>
                        </button>
                    </span>
                    <span className="me-2 my-2 my-lg-0">
                        <Link to={`/reports/products/interest/${product_id}`}>
                            <button className="btn btn-info btn-sm hover-focus">
                                <span className="me-2">Interest Report</span>
                                <i className="fa fa-bar-chart"></i>
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
                <div className="container div-dark">
                    <h3 className="mb-4">Manage Products</h3>
                    <div className="mt-5">
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
