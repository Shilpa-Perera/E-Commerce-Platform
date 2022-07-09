import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import ProductInterestReport from "./productInterestReport";
import { getProduct } from "../../../services/productService";
import { getProductInterestReport } from "../../../services/reportService";
import { toast } from "react-toastify";
import Loading from "../../common/loading";
import { elementToPdf } from "../../../utils/pdfUtils";

class ProductInterestReportPageBody extends ProductInterestReport {
    state = {
        product: null,
        options: null,
        data: null,
        reportData: null,
        loading: true,
    };

    async componentDidMount() {
        try {
            const { id: productId } = this.props;
            const { data: product } = await getProduct(productId);
            const { data: reportData } = await getProductInterestReport(
                productId
            );

            const options = this.getOptions(
                "Product Interest Report",
                this.xAxisLabel,
                this.yAxisLabel,
                true
            );

            const data = this.getData(
                product.product_title,
                reportData,
                this.labelProperty,
                this.valueProperty,
                this.getLabel
            );

            this.setState({ product, options, data, reportData, loading: false });
        } catch (e) {
            if (e.response && e.response.status === 404)
                this.props.replace("/not-found");

            toast.error("An error occurred!", { theme: "dark" });
            this.setState({ loading: false });
        }
    }

    render() {
        const { product, options, data, reportData, loading } = this.state;
        const elementId = "p-i-report-page";

        if (loading) return <Loading />;

        if (product === null || options === null || data === null) return null;

        return (
            <div className="container mb-5">
                <div id={elementId} className="mb-5 p-5">
                    {this.renderCanvasHeading(product.product_title)}
                    {this.renderCanvas(options, data)}
                    {this.renderTable(
                        reportData,
                        this.labelProperty,
                        this.valueProperty,
                        this.yAxisLabel,
                        this.xAxisLabel,
                        this.getLabel
                    )}
                </div>
                <div className="d-flex justify-content-center">
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            const filename = `${product.product_title} - Product Interest Report`;
                            elementToPdf(elementId, filename);
                        }}
                    >
                        <span className="me-2">Download</span>
                        <i className="fa fa-download"></i>
                    </button>
                </div>
            </div>
        );
    }
}

function ProductInterestReportPage(props) {
    const { id } = useParams();
    const push = useNavigate();
    const replace = (path) => push(path, { replace: true });
    return <ProductInterestReportPageBody {...{ ...props, id, replace }} />;
}

export default ProductInterestReportPage;
