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

class MostOrderCategoriesReport extends Component {
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
                    text: "Category with Most Orders",
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
                        text: "Category",
                    },
                },
            },
        };
    };

    getData = (reportData) => {
        const data = {
            labels: [],
            datasets: [
                {
                    data: [],
                    borderColor: "rgb(53, 162, 235)",
                    backgroundColor: "rgba(53, 162, 235, 0.5)",
                },
            ],
        };

        if (reportData.length > 0) {
            for (const reportDataItem of reportData) {
                data.labels.push(reportDataItem.category_name);
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

    renderCanvasHeading = () => {
        return (
            <div>
                <div className="d-flex justify-content-center mb-2">
                    <h1>Category with Most Orders</h1>
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

export default MostOrderCategoriesReport;
