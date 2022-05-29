const { CategoryController } = require("../controllers/category");
const express = require("express");
const router = express();

router.get("/", CategoryController.getAllCategories);
router.get("/:id", CategoryController.getSubCategories);
router.post("/", CategoryController.addCategory);

module.exports = router;
