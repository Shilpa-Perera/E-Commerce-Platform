import React from "react";
import { Table } from "react-bootstrap";
const MaxSaleProductsReportTable = ({ data }) => {
	return (
		<div>
			<Table striped bordered hover>
				<thead>
					<tr>
						<th>Variant Name</th>
						<th>Number of Sales</th>
					</tr>
				</thead>
				<tbody>
					{data.map((element, index) => (
						<tr key={index}>
							<td>
								{element.product_title +
									" " +
									element.variant_name}
							</td>
							<td>{element.sales}</td>
						</tr>
					))}
				</tbody>
			</Table>
		</div>
	);
};

export default MaxSaleProductsReportTable;
