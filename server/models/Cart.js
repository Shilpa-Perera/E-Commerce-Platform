const db = require('../util/database');
const dotenv = require('dotenv');
dotenv.config();

class Cart{

    static fetchAll() {
        return db.execute('select * from cart;');
    }
    
}

module.exports.Cart = Cart;