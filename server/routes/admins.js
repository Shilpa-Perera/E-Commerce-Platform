const auth = require('../middleware/auth');
const express = require("express");
const { AdminController } = require('../controllers/admin');
const router = express();

router.get("/", AdminController.getAllAdmins);
router.get("/:id", AdminController.getAdmin);
router.post("/", AdminController.postAdmin);

module.exports = router;
