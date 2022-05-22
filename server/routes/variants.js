const { VariantController } = require("../controllers/variant");
const express = require("express");
const router = express();

router.get("/", VariantController.getVariant);

module.exports = router;
