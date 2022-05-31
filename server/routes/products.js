const { ProductController } = require("../controllers/product");
const express = require("express");
const router = express();

router.get("/", ProductController.getAllProducts);
router.get("/:id", ProductController.getProduct);
router.post("/feature", ProductController.postCustomFeature);
router.post("/", ProductController.postProduct);
router.put("/feature/:id", ProductController.putCustomFeature);
router.put("/:id", ProductController.putProduct);

module.exports = router;
