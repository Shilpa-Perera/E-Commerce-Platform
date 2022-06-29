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
import { Bar } from "react-chartjs-2";
import BarChart from "./quaterlySalesReportComponents/barChart";
import QuaterlySalesReportTable from "./quaterlySalesReportComponents/quaterlySalesReportTable";

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
        // await getQuaterlySalesReport(year);

        const reports = [...this.state.reports];
        const showReports = [...this.state.showReports];

        // to test wit sample
        showReports[index] = true;
        // every variant should be there.... or product
        reports[index] = [
            [
                {
                    variant_name: "Black/Copper - 4GB ",
                    sell_total: 120000.0,
                },
                {
                    variant_name: "White/Copper - 4GB",
                    sell_total: 150000.0,
                },
                {
                    variant_name: "Black/Copper - 6GB",
                    sell_total: 130000.0,
                },
                {
                    variant_name: "Silver - 64GB",
                    sell_total: 400000.0,
                },
            ],
            [
                {
                    variant_name: "Black/Copper - 4GB ",
                    sell_total: 120000.0,
                },
                {
                    variant_name: "White/Copper - 4GB",
                    sell_total: 150000.0,
                },
                {
                    variant_name: "Black/Copper - 6GB",
                    sell_total: 130000.0,
                },
                {
                    variant_name: "Silver - 64GB",
                    sell_total: 400000.0,
                },
            ],
            [
                {
                    variant_name: "Black/Copper - 4GB ",
                    sell_total: 120000.0,
                },
                {
                    variant_name: "White/Copper - 4GB",
                    sell_total: 150000.0,
                },
                {
                    variant_name: "Black/Copper - 6GB",
                    sell_total: 130000.0,
                },
                {
                    variant_name: "Silver - 64GB",
                    sell_total: 400000.0,
                },
            ],
            [
                {
                    variant_name: "Black/Copper - 4GB ",
                    sell_total: 120000.0,
                },
                {
                    variant_name: "White/Copper - 4GB",
                    sell_total: 150000.0,
                },
                {
                    variant_name: "Black/Copper - 6GB",
                    sell_total: 130000.0,
                },
                {
                    variant_name: "Silver - 64GB",
                    sell_total: 400000.0,
                },
            ],
        ];

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

        for (let i = 0; i < report[0].length; i++) {
            const row = {
                variant_name: report[0][i].variant_name,
                q1: report[0][i].sell_total,
                q2: report[1][i].sell_total,
                q3: report[2][i].sell_total,
                q4: report[3][i].sell_total,
            };
            dataSource.push(row);

            barChartInputs.labels.push(row.variant_name);
            barChartInputs.data.push(row.q1 + row.q2 + row.q3 + row.q4);
        }

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

    render() {
        const {
            startYear,
            currentYear,
            reports,
            showReports,
            dataSource,
            barChartInputs,
        } = this.state;

        return (
            <Container>
                <h1>Quaterly Sales Report</h1>
                <Row>
                    {reports.map((report, index) => (
                        <div>
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
                                        <Modal.Title>
                                            {startYear + index} Quaterly Sales
                                            Report
                                        </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body className="show-grid">
                                        <Container>
                                            <Row>
                                                <Col md={4}>
                                                    <QuaterlySalesReportTable
                                                        dataSource={dataSource}
                                                    />
                                                </Col>

                                                <Col md={8}>
                                                    <BarChart
                                                        labels={
                                                            barChartInputs.labels
                                                        }
                                                        data={
                                                            barChartInputs.data
                                                        }
                                                    />
                                                </Col>
                                            </Row>
                                        </Container>
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
