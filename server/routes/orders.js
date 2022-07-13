const { OrderController } = require("../controllers/order");
const express = require("express");
const router = express();

router.get("/", OrderController.getAllOrders);
router.get("/year-period-of-sold", OrderController.getYearPeriodOfSold);
router.get("/:id", OrderController.getOrderCart);
router.post("/checkout", OrderController.setOrderDetails);
router.post("/checkout/payment", OrderController.confirmAndSetOrder);
router.put("/update", OrderController.updateOrderStatus);

module.exports = router;
