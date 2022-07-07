import { Modal, Button, Row, Col, Container } from "react-bootstrap";
import BarChart from "../../common/barChart";
import MaxSaleBarChart from "./maxSaleProductReportBarChart";
import MaxSalesProductsReportTable from "./maxSaleProductReportTable";

export default function MaxSaleProductsModal(props) {
	return (
		<Modal
			show={props.show}
			onHide={props.onHide}
			size="xl"
			aria-labelledby="contained-modal-title-vcenter"
			dialogClassName="modal-90vh"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title
					id="contained-modal-title-vcenter"
					className="ms-auto"
				>
					Products with most number of sales
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{props.report.length > 0 && (
					<div id="max-sales">
						<Container>
							<Row>
								<Col xs={6}>
									<MaxSaleBarChart
										key="bar-chart"
										report={props.report}
									/>
								</Col>
								<Col xs={6}>
									<MaxSalesProductsReportTable
										key="table"
										data={props.report}
									></MaxSalesProductsReportTable>
								</Col>
							</Row>
						</Container>
					</div>
				)}

				{props.report.length === 0 && (
					<h6>No sales on given time period</h6>
				)}
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={props.onHide} variant="secondary">
					<span className="me-2">Close</span>
					<i className="fa fa-close"></i>
				</Button>
				{props.report.length !== 0 && (
					<Button variant="primary" onClick={props.handledownload}>
						<span className="me-2">Download</span>
						<i className="fa fa-download"></i>
					</Button>
				)}
			</Modal.Footer>
		</Modal>
	);
}
