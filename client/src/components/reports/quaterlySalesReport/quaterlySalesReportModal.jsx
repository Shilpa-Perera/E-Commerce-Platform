import React from "react";
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
import BarChart from "../../common/barChart";
import QuaterlySalesReportTable from "./quaterlySalesReportTable";

const QuaterlySalesReportModal = ({
	key,
	show,
	handleHide,
	handleDownloadReport,
	elementId,
	year,
	index,
	dataSource,
	barChartInputs,
}) => {
	return (
		<Modal
			key={key}
			show={show}
			onHide={() => handleHide(index)}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			fullscreen={true}
		>
			<Modal.Header closeButton>
				<div className="d-flex justify-content-left">
					<Button
						variant="primary"
						onClick={() => handleDownloadReport(elementId, year)}
						key={index}
					>
						Download
					</Button>
				</div>
			</Modal.Header>
			<Modal.Body className="show-grid">
				<div id={elementId}>
					<Container>
						<h3>{year} Quaterly Sales Report</h3>
						<Row>
							<Col md={4}>
								<QuaterlySalesReportTable
									dataSource={dataSource}
								/>
							</Col>

							<Col md={8}>
								<BarChart
									labels={barChartInputs.labels}
									data={barChartInputs.data}
									label="Total Sales"
								/>
							</Col>
						</Row>
					</Container>
				</div>
			</Modal.Body>
		</Modal>
	);
};

export default QuaterlySalesReportModal;
