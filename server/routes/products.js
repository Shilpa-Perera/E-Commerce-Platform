const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const express = require("express");
const path = require("path");
const router = express();
const { ProductController } = require("../controllers/product");

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        const ext = path.extname(file.originalname);
        if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
            return callback(new Error("Only images are allowed"));
        }
        callback(null, "images/products");
    },
    filename: function (req, file, callback) {
        callback(null, `${uuidv4()}.png`);
    },
});

const upload = multer({ storage });

router.get("/unavailable", ProductController.getUnavailableProducts);
router.get("/:id", ProductController.getProduct);
router.get("/", ProductController.getAllProducts);
router.post("/restore/:id", ProductController.restoreProduct);
router.post("/check", ProductController.checkProductVariant);
router.post("/feature", ProductController.postCustomFeature);
router.post("/product-category", ProductController.postProductCategory);
router.post("/", ProductController.postProduct);
router.put("/feature/:id", ProductController.putCustomFeature);
router.put("/default/:id", ProductController.putDefault);
router.put(
    "/image/:id",
    upload.single("product_img"),
    ProductController.putImage
);
router.put("/:id", ProductController.putProduct);
router.delete("/feature/:id", ProductController.deleteFeature);
router.delete(
    "/product-category/:product_id/:category_id/:sub_category_id",
    ProductController.deleteProductCategory
);
router.delete("/:id", ProductController.deleteProduct);

module.exports = router;
