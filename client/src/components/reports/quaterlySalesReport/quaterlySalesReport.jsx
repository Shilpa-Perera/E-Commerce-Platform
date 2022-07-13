import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { getQuaterlySalesReport } from "../../../services/reportService";
import {
    Col,
    Modal,
    Row,
    Table,
    Container,
    Card,
    Button,
} from "react-bootstrap";
import BarChart from "../../common/barChart";
import { Bar } from "react-chartjs-2";
import QuaterlySalesReportTable from "./quaterlySalesReportTable";
import { elementToPdf } from "../../../utils/pdfUtils";
import QuaterlySalesReportModal from "./quaterlySalesReportModal";

class QuaterlySalesReport extends Component {
    state = {
        startYear: 2020,
        currentYear: 2022,
        reports: [],
        showReports: [],
        dataSource: [],
        barChartInputs: {},
        barChartOptions: {
            plugins: {
                title: {
                    display: false,
                },
            },
            responsive: true,
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                },
            },
        },
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
            quater1: [],
            quater2: [],
            quater3: [],
            quater4: [],
            total: [],
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
            data[item.item_name]["q".concat(item.quater.toString())] +=
                parseInt(item.sell_total);
        });

        Object.keys(data).forEach((key) => {
            barChartInputs.labels.push(key);
            barChartInputs.quater1.push(data[key].q1);
            barChartInputs.quater2.push(data[key].q2);
            barChartInputs.quater3.push(data[key].q3);
            barChartInputs.quater4.push(data[key].q4);
            barChartInputs.total.push(
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
            barChartOptions,
        } = this.state;

        const elementId = `quaterly-sales-report`;

        return (
            <Container>
                <h1 className="text-center">Quaterly Sales Report</h1>
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
                                <Modal
                                    key={index}
                                    show={showReports[index]}
                                    onHide={() => this.closeReport(index)}
                                    size="lg"
                                    aria-labelledby="contained-modal-title-vcenter"
                                    fullscreen={true}
                                >
                                    <Modal.Header closeButton>
                                        <div className="d-flex justify-content-left">
                                            <Button
                                                variant="primary"
                                                onClick={() =>
                                                    this.downloadReport(
                                                        elementId,
                                                        startYear + index
                                                    )
                                                }
                                                key={index}
                                            >
                                                Download
                                            </Button>
                                        </div>
                                    </Modal.Header>
                                    <Modal.Body className="show-grid">
                                        <div id={elementId}>
                                            <Container>
                                                <h3>
                                                    {startYear + index} Quaterly
                                                    Sales Report
                                                </h3>
                                                <Row>
                                                    <Bar
                                                        options={
                                                            barChartOptions
                                                        }
                                                        data={{
                                                            labels: barChartInputs.labels,
                                                            datasets: [
                                                                {
                                                                    label: "Quater 1",
                                                                    data: barChartInputs.quater1,
                                                                    backgroundColor:
                                                                        "rgb(255, 99, 132)",
                                                                },
                                                                {
                                                                    label: "Quater 2",
                                                                    data: barChartInputs.quater2,
                                                                    backgroundColor:
                                                                        "rgb(75, 192, 192)",
                                                                },
                                                                {
                                                                    label: "Quater 3",
                                                                    data: barChartInputs.quater3,
                                                                    backgroundColor:
                                                                        "rgb(53, 162, 235)",
                                                                },
                                                                {
                                                                    label: "Quater 4",
                                                                    data: barChartInputs.quater4,
                                                                    backgroundColor:
                                                                        "rgb(255, 159, 64)",
                                                                },
                                                            ],
                                                        }}
                                                    />
                                                </Row>
                                                <Row>
                                                    <QuaterlySalesReportTable
                                                        dataSource={dataSource}
                                                    />
                                                </Row>
                                            </Container>
                                        </div>
                                    </Modal.Body>
                                </Modal>
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
