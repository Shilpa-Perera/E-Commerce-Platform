import React from "react";
import { Bar } from "react-chartjs-2";

const BarChart = ({ labels, data }) => {
    return (
        <div>
            <Bar
                data={{
                    labels: labels,
                    datasets: [
                        {
                            label: "Total Sales",
                            data: data,
                            backgroundColor: ["orange"],
                        },
                    ],
                }}
                height={400}
                width={600}
                options={
                    {
                        // maintainAspectRatio: false,
                        // indexAxis: "x",
                        // tooltips: {
                        //     callbacks: {
                        //         title: function (item, everything) {
                        //             return "tooltip";
                        //         },
                        //         label: function (item, everything) {
                        //             return "0222";
                        //         },
                        //     },
                        // },
                    }
                }
            />
        </div>
    );
};

export default BarChart;
