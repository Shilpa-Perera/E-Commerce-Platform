const { CustomerController } = require("../controllers/customer");
const auth = require('../middleware/auth');
const authPage = require('../middleware/authPage');
const ROLE = require("../util/roles.json");
const express = require("express");
const { OrderController } = require("../controllers/order");
const router = express();

router.get("/addresses", [auth], CustomerController.getCustomerAddresses);
router.get("/mobiles", [auth], CustomerController.getCustomerMobiles);
router.get("/orders/:id", [auth], OrderController.getCustomerOrders);
router.get("/", CustomerController.getAllCustomers);
router.get("/:id", [auth, authPage([ROLE.ADMIN, ROLE.CUSTOMER])], CustomerController.getCustomer);
router.post("/", CustomerController.postCustomer);
router.put("/:id", [auth], CustomerController.updateCustomer);
router.delete("/addresses/:id", [auth], CustomerController.deleteCustomerAddress)

module.exports = router;
