import React, { Component } from "react";
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

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

class ProductInterestReport extends Component {
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

    getOptions = () => {
        return {
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
    };

    getData = ({ product_title }, reportData) => {
        const data = {
            labels: [],
            datasets: [
                {
                    label: product_title,
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

        return data;
    };

    renderCanvasHeading = (title) => {
        return (
            <div>
                <div className="d-flex justify-content-center mb-2">
                    <h1>Product Interest Report</h1>
                </div>
                <div className="d-flex justify-content-center mb-4">
                    <h3>{title}</h3>
                </div>
            </div>
        );
    };

    renderCanvas = (options, data) => {
        return (
            <div className="container">
                <div className="d-flex justify-content-center">
                    <Bar options={options} data={data} />
                </div>
            </div>
        );
    };
}

export default ProductInterestReport;