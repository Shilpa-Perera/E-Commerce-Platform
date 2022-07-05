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
import { getChartBackgroundColors } from "../../../utils/chartColors";

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
                    display: false,
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
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: "Orders Count",
                    },
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: "Month",
                    },
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

            const { borderColors, bgColors } = getChartBackgroundColors(
                reportData.length
            );
            data.datasets[0].borderColor = borderColors;
            data.datasets[0].backgroundColor = bgColors;
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
