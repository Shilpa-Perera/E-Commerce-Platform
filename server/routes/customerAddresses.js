const { CustomerAddressController } = require("../controllers/customerAddress");
const express = require("express");
const router = express();

router.get("/", CustomerAddressController.getAllCustomers);
router.get("/:id", CustomerAddressController.getCustomer);
router.post("/", CustomerAddressController.postCustomer);

module.exports = router;
