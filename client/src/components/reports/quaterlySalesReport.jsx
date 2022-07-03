import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { getQuaterlySalesReport } from "../../services/reportService";
import {
    Col,
    Modal,
    Row,
    Table,
    Container,
    Card,
    Button,
} from "react-bootstrap";

import QuaterlySalesReportTable from "./quaterlySalesReportComponents/quaterlySalesReportTable";
import { elementToPdf } from "./../../utils/pdfUtils";
import QuaterlySalesReportModal from "./quaterlySalesReportComponents/quaterlySalesReportModal";

class QuaterlySalesReport extends Component {
    state = {
        startYear: 2020,
        currentYear: 2022,
        reports: [],
        showReports: [],
        dataSource: [],
        barChartInputs: {},
    };

    componentDidMount() {
        const { startYear, currentYear } = { ...this.state };
        const reports = [];
        const showReports = [];
        for (let i = 0; i < currentYear - startYear + 1; i++) {
            reports.push([]);
            showReports.push(false);
        }
        this.setState({ reports, showReports });
    }

    async loadReport(index) {
        const year = this.state.startYear + index;
        console.log("year", year);
        const { data: loadedReport } = await getQuaterlySalesReport(year);

        const reports = [...this.state.reports];
        const showReports = [...this.state.showReports];

        showReports[index] = true;
        reports[index] = loadedReport;

        const { dataSource, barChartInputs } = this.mapReportToDataSource(
            reports[index]
        );

        this.setState({
            reports,
            showReports,
            dataSource,
            barChartInputs,
        });
    }

    mapReportToDataSource(report) {
        const dataSource = [];
        const barChartInputs = {
            labels: [],
            data: [],
        };

        const data = {};

        report.forEach((item) => {
            // if item_name in data.keys
            if (!Object.keys(data).includes(item.item_name)) {
                data[item.item_name] = {
                    q1: 0,
                    q2: 0,
                    q3: 0,
                    q4: 0,
                };
            }
            data[item.item_name]["q".concat(item.quater.toString())] = parseInt(
                item.sell_total
            );
        });

        Object.keys(data).forEach((key) => {
            barChartInputs.labels.push(key);
            barChartInputs.data.push(
                data[key].q1 + data[key].q2 + data[key].q3 + data[key].q4
            );

            const dataSourceItem = { variant_name: key, ...data[key] };
            dataSource.push(dataSourceItem);
        });

        return {
            dataSource: dataSource,
            barChartInputs: barChartInputs,
        };
    }

    closeReport(index) {
        const reports = [...this.state.reports];
        const showReports = [...this.state.showReports];

        reports[index] = [];
        showReports[index] = false;

        this.setState({ reports, showReports });
    }

    downloadReport(elementId, year) {
        const filename = `${year} - Quaterly Sales Report`;
        elementToPdf(elementId, filename);
    }

    render() {
        const {
            startYear,
            currentYear,
            reports,
            showReports,
            dataSource,
            barChartInputs,
        } = this.state;

        const elementId = `quaterly-sales-report`;

        return (
            <Container>
                <h1>Quaterly Sales Report</h1>
                <Row>
                    {reports.map((report, index) => (
                        <div key={index}>
                            <Card
                                className="text-center mb-2"
                                style={{ width: "18rem" }}
                            >
                                {startYear + index}
                                <Button
                                    variant="primary"
                                    onClick={() => this.loadReport(index)}
                                    key={index}
                                >
                                    View Report
                                </Button>
                            </Card>

                            {report.length !== 0 && (
                                <QuaterlySalesReportModal
                                    key={index}
                                    show={showReports[index]}
                                    handleHide={this.closeReport}
                                    handleDownloadReport={this.downloadReport}
                                    elementId={elementId}
                                    dataSource={dataSource}
                                    year={startYear + index}
                                    index={index}
                                    barChartInputs={barChartInputs}
                                />
                                // <Modal
                                //     key={index}
                                //     show={showReports[index]}
                                //     onHide={() => this.closeReport(index)}
                                //     size="lg"
                                //     aria-labelledby="contained-modal-title-vcenter"
                                //     fullscreen={true}
                                // >
                                //     <Modal.Header closeButton>
                                //         <div class="d-flex justify-content-left">
                                //             <Button
                                //                 variant="primary"
                                //                 onClick={() =>
                                //                     this.downloadReport(
                                //                         elementId,
                                //                         startYear + index
                                //                     )
                                //                 }
                                //                 key={index}
                                //             >
                                //                 Download
                                //             </Button>
                                //         </div>
                                //     </Modal.Header>
                                //     <Modal.Body className="show-grid">
                                //         <div id={elementId}>
                                //             <Container>
                                //                 <h3>
                                //                     {startYear + index} Quaterly
                                //                     Sales Report
                                //                 </h3>
                                //                 <Row>
                                //                     <Col md={4}>
                                //                         <QuaterlySalesReportTable
                                //                             dataSource={
                                //                                 dataSource
                                //                             }
                                //                         />
                                //                     </Col>

                                //                     <Col md={8}>
                                //                         <BarChart
                                //                             labels={
                                //                                 barChartInputs.labels
                                //                             }
                                //                             data={
                                //                                 barChartInputs.data
                                //                             }
                                //                         />
                                //                     </Col>
                                //                 </Row>
                                //             </Container>
                                //         </div>
                                //     </Modal.Body>
                                // </Modal>
                            )}

                            {report.length === 0 && (
                                <Modal
                                    key={"no-report".concat(index)}
                                    show={showReports[index]}
                                    onHide={() => this.closeReport(index)}
                                    size="lg"
                                    aria-labelledby="contained-modal-title-vcenter"
                                    fullscreen={false}
                                >
                                    <Modal.Header closeButton>
                                        <Modal.Title>
                                            {startYear + index} Quaterly Sales
                                            Report
                                        </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <span className="warning">
                                            No items are sold on{" "}
                                            {startYear + index} to generate a
                                            report.
                                        </span>
                                    </Modal.Body>
                                </Modal>
                            )}
                        </div>
                    ))}
                </Row>
            </Container>
        );
    }
}

export default QuaterlySalesReport;
