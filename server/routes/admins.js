const auth = require('../middleware/auth');
const authPage = require('../middleware/authPage');
const ROLE = require("../util/roles.json");
const express = require("express");
const { AdminController } = require('../controllers/admin');
const router = express();

router.get("/", [auth, authPage([ROLE.ADMIN])], AdminController.getAllAdmins);
router.get("/:id", [auth, authPage([ROLE.ADMIN])], AdminController.getAdmin);
router.post("/", [auth, authPage([ROLE.ADMIN])], AdminController.postAdmin);

module.exports = router;
