import React from "react";
import Report from "../../common/report";

class ProductInterestReport extends Report {
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

    xAxisLabel = "Orders Count";
    yAxisLabel = "Month";
    labelProperty = "";
    valueProperty = "count";

    getLabel = (reportDataItem) => {
        return `${this.months[reportDataItem.month - 1]} ${
            reportDataItem.year
        }`;
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

    renderInterestTable(reportData) {
        return this.renderTable(
            reportData,
            this.labelProperty,
            this.valueProperty,
            this.yAxisLabel,
            this.xAxisLabel,
            "text-center",
            "w-75",
            this.getLabel
        );
    }
}

export default ProductInterestReport;
