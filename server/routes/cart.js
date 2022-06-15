const {CartController} = require('../controllers/cart') ;
const express = require('express');
const router = express();

router.get('/', CartController.getAllCarts);
router.get('/:id',CartController.getCartByID);
router.get('/products/:id' , CartController.getCartProducts) ;
router.post('/',CartController.addProductToCart) ;
router.put('/',CartController.updateItemCount) ;
module.exports = router; 