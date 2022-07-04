const auth = require("../middleware/auth");
const authPage = require("../middleware/authPage");
const ROLE = require("../util/roles.json");
const express = require("express");
const { ReportController } = require("../controllers/report");
const router = express();

router.get(
	"/products/interest/:id",
	[auth, authPage([ROLE.ADMIN])],
	ReportController.getProductInterestReport
);
router.get(
	"/max_sale/:start_date/:end_date/:no_of_rows",
	[auth, authPage([ROLE.ADMIN])],
	ReportController.getMaxSaleProductsReport
);

router.get(
	"/quaterly-sales-report/:year",
	[auth, authPage([ROLE.ADMIN])],
	ReportController.getQuaterlySalesReport
);

module.exports = router;
