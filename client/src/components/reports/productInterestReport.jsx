import React, { Component } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductInterestReport } from "../../services/reportService";
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { getProduct } from "../../services/productService";
import Loading from "../common/loading";
import { elementToPdf } from "../../utils/pdfUtils";
import { toast } from "react-toastify";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

class ProductInterestReportBody extends Component {
    state = {
        product: null,
        options: null,
        data: null,
        loading: true,
    };

    months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    async componentDidMount() {
        try {
            const { id: productId } = this.props;
            const { data: product } = await getProduct(productId);
            const { data: reportData } = await getProductInterestReport(
                productId
            );

            const options = {
                indexAxis: "y",
                elements: {
                    bar: {
                        borderWidth: 2,
                    },
                },
                responsive: true,
                plugins: {
                    legend: {
                        position: "right",
                    },
                    title: {
                        display: true,
                        text: "Product Interest Report",
                    },
                },
                scale: {
                    ticks: {
                        precision: 0,
                    },
                },
            };

            const data = {
                labels: [],
                datasets: [
                    {
                        label: product.product_title,
                        data: [],
                        borderColor: "rgb(53, 162, 235)",
                        backgroundColor: "rgba(53, 162, 235, 0.5)",
                    },
                ],
            };

            if (reportData.length > 0) {
                for (const reportDataItem of reportData) {
                    data.labels.push(
                        `${this.months[reportDataItem.month - 1]} ${
                            reportDataItem.year
                        }`
                    );
                    data.datasets[0].data.push(reportDataItem.count);
                }
            }

            this.setState({ product, options, data, loading: false });
        } catch (e) {
            if (e.response && e.response.status === 404)
                this.props.replace("/not-found");

            toast.error("An error occurred!", { theme: "dark" });
            this.setState({ loading: false });
        }
    }

    render() {
        const { product, options, data, loading } = this.state;
        const elementId = "p-i-report";

        if (loading) return <Loading />;

        if (product === null || options === null || data === null) return null;

        return (
            <div className="container mb-5">
                <div id={elementId} className="mb-5 p-5">
                    <div>
                        <div className="d-flex justify-content-center mb-2">
                            <h2>Product Interest Report</h2>
                        </div>
                        <div className="d-flex justify-content-center mb-4">
                            <h4>{product.product_title}</h4>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center">
                        <Bar options={options} data={data} />
                    </div>
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

function ProductInterestReport(props) {
    const { id } = useParams();
    const push = useNavigate();
    const replace = (path) => push(path, { replace: true });
    return <ProductInterestReportBody {...{ ...props, id, replace }} />;
}

export default ProductInterestReport;
