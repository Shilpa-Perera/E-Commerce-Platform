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
import { getChartBackgroundColors } from "../../utils/chartColors";
import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

class Report extends Component {
    getData = (
        title,
        reportData,
        labelProperty,
        valueProperty,
        labelCallback = null
    ) => {
        const data = {
            labels: [],
            datasets: [
                {
                    label: title,
                    data: [],
                    borderColor: "rgb(53, 162, 235)",
                    backgroundColor: "rgba(53, 162, 235, 0.5)",
                },
            ],
        };

        if (reportData.length > 0) {
            for (const reportDataItem of reportData) {
                if (labelCallback === null)
                    data.labels.push(reportDataItem[labelProperty]);
                else data.labels.push(labelCallback(reportDataItem));

                data.datasets[0].data.push(reportDataItem[valueProperty]);
            }

            const { borderColors, bgColors } = getChartBackgroundColors(
                reportData.length
            );
            data.datasets[0].borderColor = borderColors;
            data.datasets[0].backgroundColor = bgColors;
        }

        return data;
    };

    getOptions = (title, xAxisLabel, yAxisLabel, isHorizontal = false) => {
        return {
            indexAxis: isHorizontal ? "y" : "x",
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
                    text: title,
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
                        text: xAxisLabel,
                    },
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: yAxisLabel,
                    },
                },
            },
        };
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

    renderTable = (
        reportData,
        labelProperty,
        valueProperty,
        labelName,
        valueName,
        tableAdditionalClasses = "",
        tableWrapperClasses = "",
        labelCallback = null
    ) => {
        return (
            <div className="container mt-5">
                <div className="d-flex justify-content-center">
                    <div className={tableWrapperClasses}>
                        <div className="table-responsive">
                            <table
                                className={`table ${tableAdditionalClasses}`}
                            >
                                <thead>
                                    <tr>
                                        <th scope="col">{labelName}</th>
                                        <th scope="col">{valueName}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.map((reportDataItem, index) => (
                                        <tr key={index}>
                                            <td>
                                                {labelCallback &&
                                                    labelCallback(
                                                        reportDataItem
                                                    )}
                                                {!labelCallback &&
                                                    reportDataItem[
                                                        labelProperty
                                                    ]}
                                            </td>
                                            <td>
                                                {reportDataItem[valueProperty]}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
}

export default Report;
