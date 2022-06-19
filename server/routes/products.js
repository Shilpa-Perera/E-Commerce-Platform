const { v4: uuidv4 } = require("uuid");
const auth = require("../middleware/auth");
const authPage = require("../middleware/authPage");
const ROLE = require("../util/roles.json");
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

router.get(
    "/unavailable",
    [auth, authPage([ROLE.ADMIN])],
    ProductController.getUnavailableProducts
);
router.get("/:id", ProductController.getProduct);
router.get("/", ProductController.getAllProducts);

router.post(
    "/restore/:id",
    [auth, authPage([ROLE.ADMIN])],
    ProductController.restoreProduct
);
router.post(
    "/check",
    [auth, authPage([ROLE.ADMIN])],
    ProductController.checkProductVariant
);
router.post(
    "/feature",
    [auth, authPage([ROLE.ADMIN])],
    ProductController.postCustomFeature
);
router.post(
    "/product-categories",
    [auth, authPage([ROLE.ADMIN])],
    ProductController.postProductCategory
);
router.post("/", [auth, authPage([ROLE.ADMIN])], ProductController.postProduct);

router.put(
    "/feature/:id",
    [auth, authPage([ROLE.ADMIN])],
    ProductController.putCustomFeature
);
router.put(
    "/default/:id",
    [auth, authPage([ROLE.ADMIN])],
    ProductController.putDefault
);
router.put(
    "/image/:id",
    [auth, authPage([ROLE.ADMIN]), upload.single("product_img")],
    ProductController.putImage
);
router.put(
    "/:id",
    [auth, authPage([ROLE.ADMIN])],
    ProductController.putProduct
);

router.delete(
    "/feature/:id",
    [auth, authPage([ROLE.ADMIN])],
    ProductController.deleteFeature
);
router.delete(
    "/product-categories/:product_id/:category_id/:sub_category_id",
    [auth, authPage([ROLE.ADMIN])],
    ProductController.deleteProductCategory
);
router.delete(
    "/:id",
    [auth, authPage([ROLE.ADMIN])],
    ProductController.deleteProduct
);

module.exports = router;
