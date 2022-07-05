import React from "react";
import ProductInterestReport from "./productInterestReport";
import Loading from "../../common/loading";
import { Link } from "react-router-dom";
import { elementToPdf } from "../../../utils/pdfUtils";

class ProductInterestReportModal extends ProductInterestReport {
    render() {
        const { product, reportData, loading, onClose } = this.props;

        let options = [];
        let data = [];
        const available = product !== null && reportData !== null;
        const elementId = "p-i-report-modal";

        if (available) {
            options = this.getOptions(
                "Product Interest Report",
                "Orders Count",
                "Month",
                true
            );
            data = this.getData(
                product.product_title,
                reportData,
                "",
                "count",
                this.getLabel
            );
        }

        return (
            <div
                className="modal fade"
                id="p-i-modal"
                tabIndex="-1"
                aria-labelledby="p-i-modal"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="p-i-modal-label">
                                Product Interest Report
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={onClose}
                            ></button>
                        </div>
                        <div className="modal-body">
                            {loading ? (
                                <Loading />
                            ) : (
                                available && (
                                    <div id={elementId} className="mt-4">
                                        {this.renderCanvasHeading(
                                            product.product_title
                                        )}
                                        {this.renderCanvas(options, data)}
                                    </div>
                                )
                            )}
                        </div>
                        <div className="modal-footer">
                            {available && (
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => {
                                        const filename = `${product.product_title} - Product Interest Report`;
                                        elementToPdf(elementId, filename);
                                    }}
                                >
                                    <span className="me-2">Download</span>
                                    <i className="fa fa-download"></i>
                                </button>
                            )}
                            {available && (
                                <Link
                                    to={`/reports/products/interest/${product.product_id}`}
                                    target="_blank"
                                >
                                    <button
                                        type="button"
                                        className="btn btn-info"
                                    >
                                        <span className="me-2">Open</span>
                                        <i className="fa fa-external-link"></i>
                                    </button>
                                </Link>
                            )}
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                                onClick={onClose}
                            >
                                <span className="me-2">Close</span>
                                <i className="fa fa-close"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProductInterestReportModal;
