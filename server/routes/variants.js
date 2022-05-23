const { VariantController } = require("../controllers/variant");
const express = require("express");
const router = express();

router.get("/", VariantController.getVariant);
router.post("/", VariantController.postVariant);
router.put("/:id", VariantController.putVariant);

module.exports = router;
