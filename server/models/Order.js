const db = require("../util/database");
const dotenv = require("dotenv");
dotenv.config();

class Order {
    constructor(orderDetails) {
        this.order_id = orderDetails.order_id;
        this.customer_id = orderDetails.customer_id;
        this.cart_id = orderDetails.cart_id;
        this.date = orderDetails.date;
        this.order_name = orderDetails.order_name;
        this.delivery_address = orderDetails.delivery_address;
        this.phone_number = orderDetails.phone_number;
        this.delivery_method = orderDetails.delivery_method;
        this.payment = orderDetails.payment;
    }

    static fetchAll() {
        const select_all_query = "SELECT * FROM `order` ORDER BY date ASC;";
        return db.execute(select_all_query);
    }

    static async getOrderById(orderId) {
        const product_values_query =
            "SELECT * FROM `order` NATURAL JOIN sell WHERE `order`.order_id = ?;";
        const result = await db.execute(product_values_query, [orderId]);
        return result[0];
    }

    static async updateOrderStatus(orderStatus, orderId) {
        const update_status_query =
            "UPDATE sell SET delivery_state = ? WHERE order_id = ?";
        const result = await db.execute(update_status_query, [
            orderStatus,
            orderId,
        ]);
        return result;
    }

    static async getMostPurchasedCatergory() {
        const mostOrderedCatergory = "";
        const result = await db.execute(mostOrderedCatergory);
        return result[0];
    }

    static async getOrderCart(orderId) {
        const getOrderCart =
            "SELECT variant_name, variant_id, product_id, number_of_items, product_title, price  FROM `order` JOIN (SELECT cart.cart_id, variant.variant_name, variant.variant_id, variant.product_id, number_of_items, price FROM `cart_product` JOIN cart ON cart_product.cart_id = cart.cart_id JOIN variant ON variant.variant_id = cart_product.variant_id) AS X ON X.cart_id = `order`.cart_id natural JOIN product WHERE order_id = ?;";
        // const getOrderCart = "SELECT variant_name, variant_id, product_id, number_of_items  FROM `order` JOIN (SELECT cart.cart_id, variant.variant_name, variant.variant_id, variant.product_id, number_of_items FROM `cart_product` JOIN cart ON cart_product.cart_id = cart.cart_id JOIN variant ON variant.variant_id = cart_product.variant_id) AS X ON X.cart_id = `order`.cart_id WHERE order_id = ?;";
        const result = await db.execute(getOrderCart, [orderId]);
        return result;
    }

    static async insertNewOrder(details) {
        // `customer_id`, `cart_id`, `date`, `order_name`,
        //`delivery_address`, `phone_number`, `delivery_method`,
        //`payment_method`

        //`date_time`, `delivery_state`, `payment_state`

        console.log("in to DB:", details);
        const insertOrder =
            "START TRANSACTION; INSERT INTO `order` (`customer_id`, `cart_id`, `date`, `order_name`, `delivery_address`, `phone_number`, `delivery_method`, `payment_method`) VALUES (NULL, '1', '2022-06-28 15:28:17.000000', 'dawd', 'qweqwrqr', '123124124', 'STORE-PICKUP', 'CARD'); INSERT INTO `sell` (`date_time`, `order_id`, `delivery_state`, `payment_state`) VALUES ('2022-06-28 15:28:41.000000', '2', 'PROCESSING', 'PENDING');COMMIT;  ";
        // const result =  await db.execute(insertOrder,[]);
        return "result";
    }
}

module.exports.Order = Order;



// START TRANSACTION; 
// UPDATE variant 
// INSERT INTO `order` (`customer_id`, `cart_id`, `date`, `order_name`, `delivery_address`, `phone_number`, `delivery_method`, `payment_method`) VALUES (NULL, '1', '2022-06-28 15:28:17.000000', 'dawd', 'qweqwrqr', '123124124', 'STORE-PICKUP', 'CARD'); 

// INSERT INTO `sell` (`date_time`, `order_id`, `delivery_state`, `payment_state`) VALUES ('2022-06-28 15:28:41.000000', '2', 'PROCESSING', 'PENDING');
// CREATE PROCEDURE

// COMMIT;


// DELIMITER &&  
// CREATE PROCEDURE update_products (IN quantityRemoved INT, IN variantID INT)  
// BEGIN  
// 	DECLARE totalOrder INT DEFAULT 0;
// 	SELECT quantity INTO totalOrder FROM variant WHERE variant_id = variantId;
// 	UPDATE `variant` SET `quantity` = totalOrder-quantityRemoved WHERE `variant`.`variant_id` = variantID;
// END &&

// DELIMITER ;  



// DELIMITER &&
// CREATE PROCEDURE cart_transaction (IN cartId INT)  
// BEGIN  
// 	DECLARE n TABLE DEFAULT 0;
// 	DECLARE i INT DEFAULT 0;
// 	SELECT COUNT(*) FROM `variant` NATURAL JOIN cart_product WHERE cart_id=cartId INTO n;
// 	SET i=0;
// 	WHILE i<n DO 
//   		INSERT INTO table_B(ID, VAL) SELECT (ID, VAL) FROM table_A LIMIT i,1;
//         update_products(14,1);
//   		SET i = i + 1;
// 	END WHILE;
// END &&

// DELIMITER ;


// SELECT * FROM `variant` NATURAL JOIN cart_product WHERE cart_id=1;