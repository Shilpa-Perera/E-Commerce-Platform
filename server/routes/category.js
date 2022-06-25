const { CategoryController } = require("../controllers/category");
const express = require("express");
const router = express();

router.get("/category", CategoryController.getAllCategories);
router.get("/sub-category", CategoryController.getAllSubCategories);
router.get("/:id", CategoryController.getSubCategories);
router.get("/link-category/:id", CategoryController.getSubCategoriesToLink);
router.post("/link-category", CategoryController.linkSubCategories);
router.post("/add-category", CategoryController.addCategory);
router.post("/add-sub-category", CategoryController.addSubCategory);

module.exports = router;
