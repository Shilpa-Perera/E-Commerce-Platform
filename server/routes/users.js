const {UserController} = require('../controllers/user');
const express = require('express');
const router = express();

router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUser);
router.post('/', UserController.postUser);

module.exports = router;