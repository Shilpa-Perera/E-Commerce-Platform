const _ = require("lodash");
const { Report } = require("../models/Report");

class ReportController {
    static async getProductInterestReport(req, res, next) {
        const ProductId = req.params.id;
        const reportData = await Report.getProductInterest(ProductId);
        res.send(reportData);
    }

    static async getMaxSaleProductsReport(req,res,next){
        const start_date = req.params.start_date ;
        const end_date =  req.params.end_date ;
        const max_sale_products = await Report.getMaxSaleProducts(start_date,end_date);
        res.send(max_sale_products) ;
    }
}

module.exports.ReportController = ReportController;
