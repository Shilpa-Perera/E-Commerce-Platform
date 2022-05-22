const { VariantController } = require("../controllers/variant");
const express = require("express");
const router = express();

router.get("/", VariantController.getVariant);
router.post("/", VariantController.postVariants);

module.exports = router;
