const { CustomerController } = require("../controllers/customer");
const auth = require('../middleware/auth');
const express = require("express");
const router = express();

router.get("/address", [auth], CustomerController.getCustomerAddresses);
router.get("/", CustomerController.getAllCustomers);
router.get("/:id", CustomerController.getCustomer);
router.get("/mobiles", [auth], CustomerController.getCustomerMobiles);
router.post("/", CustomerController.postCustomer);

module.exports = router;
