const _ = require("lodash");
const { Report } = require("../models/Report");

class ReportController {
    static async getProductInterestReport(req, res, next) {
        const ProductId = req.params.id;
        const reportData = await Report.getProductInterest(ProductId);
        res.send(reportData);
    }
}

module.exports.ReportController = ReportController;
