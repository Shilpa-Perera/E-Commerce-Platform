const bcrypt = require('bcrypt');
const {Cart} = require('../models/Cart') ; 

class CartController{

    static async getAllCarts(req, res, next) {
        const allCarts = await Cart.fetchAll();
        res.send(allCarts[0]);
    }

    static async getCartByID(req ,res ,next){
        const cart = await Cart.getCartByID(req.params.id) ;
        res.send(cart) ;
    }

    // static async getCartByUserID(req,res,next){
    //     const cart = await Cart.getCartByUserID(req.params.user_id) ;
    //     res.send(cart);

    // }

    static async getCartProducts(req,res,next){
        const products = await Cart.getCartProducts(req.params.id) ;
        res.send(products);
    }

    static async addProductToCart(req,res,next){
        console.log(req.body.cart_id) ;
        res.status(201).send("Success");

    }

    

}

module.exports.CartController = CartController;