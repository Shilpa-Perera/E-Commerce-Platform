import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { getQuaterlySalesReport } from "../../services/reportService";
import { Modal, Table } from "react-bootstrap";

class QuaterlySalesReport extends Component {
    state = {
        startYear: 2020,
        currentYear: 2022,
        reports: [],
        showReports: [],
        dataSource: [],
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
                    sell_total: "120000.00",
                },
                {
                    variant_name: "White/Copper - 4GB",
                    sell_total: "150000.00",
                },
                {
                    variant_name: "Black/Copper - 6GB",
                    sell_total: "130000.00",
                },
                {
                    variant_name: "Silver - 64GB",
                    sell_total: "400000.00",
                },
            ],
            [
                {
                    variant_name: "Black/Copper - 4GB ",
                    sell_total: "120000.00",
                },
                {
                    variant_name: "White/Copper - 4GB",
                    sell_total: "150000.00",
                },
                {
                    variant_name: "Black/Copper - 6GB",
                    sell_total: "130000.00",
                },
                {
                    variant_name: "Silver - 64GB",
                    sell_total: "400000.00",
                },
            ],
            [
                {
                    variant_name: "Black/Copper - 4GB ",
                    sell_total: "120000.00",
                },
                {
                    variant_name: "White/Copper - 4GB",
                    sell_total: "150000.00",
                },
                {
                    variant_name: "Black/Copper - 6GB",
                    sell_total: "130000.00",
                },
                {
                    variant_name: "Silver - 64GB",
                    sell_total: "400000.00",
                },
            ],
            [
                {
                    variant_name: "Black/Copper - 4GB ",
                    sell_total: "120000.00",
                },
                {
                    variant_name: "White/Copper - 4GB",
                    sell_total: "150000.00",
                },
                {
                    variant_name: "Black/Copper - 6GB",
                    sell_total: "130000.00",
                },
                {
                    variant_name: "Silver - 64GB",
                    sell_total: "400000.00",
                },
            ],
        ];

        const dataSource = this.mapReportToDataSource(reports[index]);

        this.setState({ reports, showReports, dataSource });
    }

    mapReportToDataSource(report) {
        const dataSource = [];

        for (let i = 0; i < report[0].length; i++) {
            const row = {
                variant_name: report[0][i].variant_name,
                q1: report[0][i].sell_total,
                q2: report[1][i].sell_total,
                q3: report[2][i].sell_total,
                q4: report[3][i].sell_total,
            };
            dataSource.push(row);
        }

        // this.setState({ dataSource });
        return dataSource;
    }

    closeReport(index) {
        const reports = [...this.state.reports];
        const showReports = [...this.state.showReports];

        reports[index] = [];
        showReports[index] = false;

        this.setState({ reports, showReports });
    }

    render() {
        const { startYear, currentYear, reports, showReports, dataSource } =
            this.state;

        return (
            <>
                <h1>Quaterly Sales Report</h1>
                {reports.map((report, index) => (
                    <div>
                        <button
                            onClick={() => this.loadReport(index)}
                            key={index}
                        >
                            {" "}
                            {startYear + index}
                        </button>
                        {console.log("report :", report)}

                        {report.length !== 0 && (
                            <Modal
                                key={index}
                                show={showReports[index]}
                                onHide={() => this.closeReport(index)}
                                size="lg"
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title>
                                        {startYear + index} Quaterly Sales
                                        Report
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th>Prouct Variant</th>
                                                <th>Q1</th>
                                                <th>Q2</th>
                                                <th>Q3</th>
                                                <th>Q4</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dataSource.map((row, index) => (
                                                <tr>
                                                    <td>{row.variant_name}</td>
                                                    <td>{row.q1}</td>
                                                    <td>{row.q2}</td>
                                                    <td>{row.q3}</td>
                                                    <td>{row.q4}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Modal.Body>
                            </Modal>
                        )}
                    </div>
                ))}
            </>
        );
    }
}

export default QuaterlySalesReport;
