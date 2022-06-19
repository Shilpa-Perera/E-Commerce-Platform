const { CustomerController } = require("../controllers/customer");
const auth = require('../middleware/auth');
const authPage = require('../middleware/authPage');
const ROLE = require("../util/roles.json");
const express = require("express");
const router = express();

router.get("/addresses", [auth], CustomerController.getCustomerAddresses);
router.get("/mobiles", [auth], CustomerController.getCustomerMobiles);
router.get("/", CustomerController.getAllCustomers);
router.get("/:id", [auth, authPage([ROLE.ADMIN, ROLE.CUSTOMER])], CustomerController.getCustomer);
router.post("/", CustomerController.postCustomer);
router.put("/:id", [auth], CustomerController.updateCustomer);

module.exports = router;
