const bcrypt = require('bcrypt');
const {Cart} = require('../models/Cart') ; 

class CartController{

    static async getAllCarts(req, res, next) {
        const allCarts = await Cart.fetchAll();
        res.send(allCarts);
    }

}

module.exports.CartController = CartController;