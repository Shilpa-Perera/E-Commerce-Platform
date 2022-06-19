const auth = require("../middleware/auth");
const authPage = require("../middleware/authPage");
const ROLE = require("../util/roles.json");
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
router.get("/:id", VariantController.getVariantById);
router.get("/", VariantController.getVariant);

router.post(
    "/images/:id",
    [auth, authPage([ROLE.ADMIN]), upload.single("variant_img")],
    VariantController.postImage
);
router.post("/", [auth, authPage([ROLE.ADMIN])], VariantController.postVariant);

router.put(
    "/:id",
    [auth, authPage([ROLE.ADMIN])],
    VariantController.putVariant
);

module.exports = router;
