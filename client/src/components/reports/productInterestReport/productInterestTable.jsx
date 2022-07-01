import React, { Component } from "react";
import Table from "../../common/table";
import ProductInterestReportModal from "./productInterestReportModal";
import { getProductInterestReport } from "../../../services/reportService";

class ProductInterestTable extends Component {
    state = {
        product: null,
        reportData: null,
        loading: false,
    };

    columns = [
        { path: "product_title", label: "Product Title" },
        { path: "sku", label: "SKU" },
        {
            key: "Actions",
            content: (product) => (
                <div className="d-flex flex-column flex-lg-row mb-3">
                    <span className="me-2 my-2 my-lg-0">
                        <button
                            className="btn btn-info btn-sm hover-focus"
                            onClick={() =>
                                this.showInterestReportModel(product)
                            }
                            data-bs-toggle="modal"
                            data-bs-target="#p-i-modal"
                        >
                            <span className="me-2">View Report</span>
                            <i className="fa fa-bar-chart"></i>
                        </button>
                    </span>
                </div>
            ),
            label: "Actions",
        },
    ];

    showInterestReportModel = async (product) => {
        this.setState({ loading: true });
        const { data: reportData } = await getProductInterestReport(
            product.product_id
        );
        this.setState({ product, reportData, loading: false });
    };

    clearInterestReport = () => {
        this.setState({
            product: null,
            reportData: null,
            loading: false,
        });
    };

    render() {
        const { products, sortBy, onSort } = this.props;
        const { product, reportData, loading } = this.state;

        return (
            <div className="pb-5">
                <div className="container div-dark">
                    <h3 className="mb-4">Product Interest Reports</h3>
                    <div className="mt-5">
                        <Table
                            columns={this.columns}
                            data={products}
                            sortColumn={sortBy}
                            onSort={onSort}
                        />
                        <ProductInterestReportModal
                            product={product}
                            reportData={reportData}
                            loading={loading}
                            onClose={this.clearInterestReport}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default ProductInterestTable;
