const { ProductController } = require("../controllers/product");
const express = require("express");
const router = express();

router.get("/", ProductController.getAllProducts);
router.get("/:id", ProductController.getProduct);

module.exports = router;
