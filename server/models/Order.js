const db = require('../util/database');
const dotenv = require('dotenv');
dotenv.config();

class Order{
    constructor(orderDetails) {
        this.order_Id = orderDetails.order_Id;
        
    }

    static fetchAll() {
        return db.execute('select * from order;');
    }
    
}

module.exports.Cart = Cart;