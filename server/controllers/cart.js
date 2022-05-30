const bcrypt = require('bcrypt');
const {Cart} = require('../models/Cart') ; 

class CartController{

    static async getAllCarts(req, res, next) {
        const allCarts = await Cart.fetchAll();
        res.send(allCarts[0]);
    }

}

module.exports.CartController = CartController;