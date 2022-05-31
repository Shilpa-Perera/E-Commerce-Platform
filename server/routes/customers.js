const { CustomerController } = require("../controllers/customer");
const express = require("express");
const router = express();

router.get("/", CustomerController.getAllCustomers);
router.get("/:id", CustomerController.getCustomer);
router.post("/", CustomerController.postCustomer);

router.get("/address")

module.exports = router;
