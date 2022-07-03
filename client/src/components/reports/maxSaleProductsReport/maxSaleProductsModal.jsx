import { Modal, Button, Row, Col, Container } from "react-bootstrap";
import BarChart from "../../common/barChart";
import MaxSalesProductsReportTable from "./maxSaleProductReportTable";

export default function MaxSaleProductsModal(props) {
	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Products with most number of sales
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{props.report.length > 0 && (
					<div id={props.elementId}>
						<Container>
							<Row>
								<Col xs={6}>
									<BarChart
										labels={props.labels}
										data={props.data}
										label="Number of Sales"
									/>
								</Col>
								<Col xs={6}>
									<MaxSalesProductsReportTable
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

				<Button
					variant="primary"
					onClick={() => props.handleDownloadReport(props.elementId)}
				>
					<span className="me-2">Download</span>
					<i className="fa fa-download"></i>
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
