const _ = require("lodash");
const db = require("../util/database");
const dotenv = require("dotenv");
dotenv.config();

class Report {
    static async getProductInterest(productId) {
        return null;
    }
}

module.exports.Report = Report;
