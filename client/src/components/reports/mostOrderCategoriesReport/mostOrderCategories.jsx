import React from "react";
import { getMostOrderCategories } from "../../../services/reportService";
import Loading from "../../common/loading";
import { elementToPdf } from "../../../utils/pdfUtils";
import Report from "../../common/report";

class MostOrderCategories extends Report {
    state = {
        options: null,
        data: null,
        loading: true,
    };

    renderCanvasHeading = () => {
        return (
            <div>
                <div className="d-flex justify-content-center mb-2">
                    <h1>Most Sold Categories</h1>
                </div>
            </div>
        );
    };

    async componentDidMount() {
        const { data: reportData } = await getMostOrderCategories();
        const options = this.getOptions(
            "Most Sold Categories",
            "Orders Count",
            "Category",
            true
        );
        const data = this.getData(
            "Most Sold Categories",
            reportData,
            "category_name",
            "count"
        );
        this.setState({ options, data, loading: false });
    }

    render() {
        const { options, data, loading } = this.state;
        const elementId = "m-o-c-report-page";

        if (loading) return <Loading />;

        if (options === null || data === null) return null;
        return (
            <div className="container mb-5">
                <div id={elementId} className="mb-5 p-5">
                    {this.renderCanvasHeading()}
                    {this.renderCanvas(options, data)}
                </div>
                <div className="d-flex justify-content-center">
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            const filename = `Category with Most Orders`;
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

export default MostOrderCategories;
