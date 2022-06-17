const {CartController} = require('../controllers/cart') ;
const express = require('express');
const router = express();

router.get('/new',CartController.getNewGuestCart);
router.get('/products/:id' , CartController.getCartProducts) ;
router.get('/:id',CartController.getCartByID);
router.get('/', CartController.getAllCarts);



router.post('/',CartController.addProductToCart) ;
router.put('/',CartController.updateItemCount) ;

module.exports = router; 