const {CartController} = require('../controllers/cart') ;
const express = require('express');
const router = express();

router.get('/', CartController.getAllCarts);

module.exports = router; 