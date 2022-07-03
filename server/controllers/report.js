const _ = require("lodash");
const { Report } = require("../models/Report");

class ReportController {
	static async getProductInterestReport(req, res, next) {
		const ProductId = req.params.id;
		const reportData = await Report.getProductInterest(ProductId);
		res.send(reportData);
	}

	static async getMaxSaleProductsReport(req, res, next) {
		const start_date = req.params.start_date;
		const end_date = req.params.end_date;
		const no_of_rows = req.params.no_of_rows;
		const max_sale_products = await Report.getMaxSaleProducts(
			start_date,
			end_date,
			no_of_rows
		);
		res.send(max_sale_products);
	}

	static async getQuaterlySalesReport(req, res, next) {
		const year = req.params.year;

		const report = await Report.getQuaterlySalesReport(year);
		res.send(report);
	}
}

module.exports.ReportController = ReportController;
