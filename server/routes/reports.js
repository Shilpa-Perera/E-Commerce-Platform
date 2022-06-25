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
