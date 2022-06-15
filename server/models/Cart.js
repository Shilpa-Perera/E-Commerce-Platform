const db = require('../util/database');
const dotenv = require('dotenv');
dotenv.config();

class Cart{

    static fetchAll() {
        return db.execute('select * from cart;');
    }

    static async getCartByID(cart_id){

        let stmt = `select * from cart where cart_id=? ;` ;
        const [cart, _] = await db.execute(stmt, [cart_id]);
        if (cart.length > 0) {
            return cart[0];
        }
        return false;
    }

    // static async getCartByUserID(user_id){

    //     let stmt = `select * from cart where customer_id=? ;` ;
    //     const [cart,_] = await db.execute(stmt,[user_id]) ;
    //     if (cart.length > 0) {
    //         return cart[0];
    //     }
    //     return false;

    // }

    static async getCartProducts(id){

        // To be refined
        let stmt = `select * from cart_product natural join variant join product where cart_id=? ;` ;
        const [products, _] = await db.execute(stmt, [id]);
        if (products.length > 0) {
            return products;
        }

        
        return false;
    }
    
}

module.exports.Cart = Cart;