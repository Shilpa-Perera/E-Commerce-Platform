const { ProductController } = require("../controllers/product");
const express = require("express");
const router = express();

router.get("/", ProductController.getAllProducts);
router.get("/:id", ProductController.getProduct);
router.post("/", ProductController.postProduct);

module.exports = router;
