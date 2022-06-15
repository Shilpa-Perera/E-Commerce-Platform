const db = require('../util/database');
const dotenv = require('dotenv');
dotenv.config();

class Cart{

    constructor(cartDetails){
        /* Single Cart */
        this.cart_id = cartDetails.cart_id ;
        this.customer_id = cartDetails.customer_id ;
        this.state = cartDetails.state ;
    }

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
        // Cart item : cart_id , variant_id , variant_name , product_title , variant_image , price , number of items
        let stmt = `select cp.cart_id , cp.variant_id , v.variant_name , cp.number_of_items , v.price , p.product_title , p.product_id from 
                    cart_product cp natural join variant v inner join product p using (product_id) where cart_id=? ;` ;
        const [products, _] = await db.execute(stmt, [id]);
        if (products.length > 0) {
            return products;
        }
        return false;
    }

    static async updateItemCount(cart_id , variant_id , number_of_items ){

        let stmt = `update cart_product set number_of_items = ? where cart_id = ? and variant_id = ? `
        await db.execute(stmt , [number_of_items , cart_id , variant_id ]) ; 
    }
    
}

module.exports.Cart = Cart;