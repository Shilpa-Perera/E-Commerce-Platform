const { OrderController } = require("../controllers/order");
const express = require("express");
const router = express();

router.get("/", OrderController.getAllOrders);
// router.get("/:id", OrderController.getOrder);
// router.post("/", OrderController.postOrder);
// router.put("/:id", OrderController.putOrder);

module.exports = router;
