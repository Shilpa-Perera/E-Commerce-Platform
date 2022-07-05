import { Component } from "react";
import { getMostOrderCategories } from "../../../services/reportService";
import Loading from "../../common/loading";
import { elementToPdf } from "../../../utils/pdfUtils";
import MostOrderCategoriesReport from "./mostOrderCategoriesReport";

class MostOrderCategories extends MostOrderCategoriesReport {
    state = {
        options: null,
        data: null,
        loading: true,
    };

    async componentDidMount() {
        const { data: reportData } = await getMostOrderCategories();
        const options = this.getOptions();
        const data = this.getData(reportData);
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
