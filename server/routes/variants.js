const { VariantController } = require("../controllers/variant");
const express = require("express");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const router = express();

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        const ext = path.extname(file.originalname);
        if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
            return callback(new Error("Only images are allowed"));
        }
        callback(null, "images/variants");
    },
    filename: function (req, file, callback) {
        callback(null, `${uuidv4()}.png`);
    },
});

const upload = multer({ storage });

router.get("/images/:id", VariantController.getImages);
router.get("/", VariantController.getVariant);
router.post(
    "/images/:id",
    upload.single("variant_img"),
    VariantController.postImage
);
router.post("/", VariantController.postVariant);
router.put("/:id", VariantController.putVariant);

module.exports = router;
