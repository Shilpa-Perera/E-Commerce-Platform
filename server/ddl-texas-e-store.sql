create database if not exists texas_e_store;

use texas_e_store;

set @var = if (
    (
        select true from information_schema.TABLE_CONSTRAINTS where
            CONSTRAINT_SCHEMA = DATABASE() AND
            TABLE_NAME        = 'product' AND
            CONSTRAINT_NAME   = 'FK_Product_DefaultVariant' AND
            CONSTRAINT_TYPE   = 'FOREIGN KEY'
    ) = true,
        'alter table product
            drop foreign key FK_Product_DefaultVariant', 'select 1
');

prepare stmt from @var;
execute stmt;
deallocate prepare stmt;

drop table if exists customer_mobile;
drop table if exists customer_address;
drop table if exists cart_product;
drop table if exists sell;
drop table if exists `order`;
drop table if exists cart;
drop table if exists admin;
drop table if exists customer;
drop table if exists variant_image;
drop table if exists variant_values;
drop table if exists variant_option_values;
drop table if exists variant_option;
drop table if exists variant;
drop table if exists custom_feature;
drop table if exists product_category;
drop table if exists product;
drop table if exists category_link;
drop table if exists sub_category;
drop table if exists category;
drop view if exists texas_e_store.items ;

DELIMITER $$
--
-- Procedures
--
CREATE PROCEDURE `order_transaction` (IN `orderCartId` INT(10), IN `orderDate` DATETIME, IN `orderName` VARCHAR(255), IN `orderAddress` VARCHAR(255), IN `orderZipcode` VARCHAR(10), IN `orderPhoneNumber` VARCHAR(255), IN `orderDeliveryMethod` ENUM('STORE-PICKUP','DELIVERY'), IN `orderPaymentMethod` ENUM('CASH','CARD'), IN `orderCustomerId` INT(10), IN `sellDateTime` DATETIME, IN `sellPaymentStatus` ENUM('PENDING','PAID'), OUT `orderIdOutput` INT(10))  BEGIN
 
 DECLARE exit handler for sqlexception
   BEGIN
     -- ERROR
   ROLLBACK;
 END;
   

 
 START TRANSACTION;
   INSERT INTO `order` (`customer_id`, `cart_id`, `date`, `order_name`, `delivery_address`, `zip_code`, `phone_number`, `delivery_method`, `payment_method`) VALUES (orderCustomerId, orderCartId, orderDate, orderName, orderAddress, orderZipCode, orderPhoneNumber, orderDeliveryMethod, orderPaymentMethod);
   SELECT @newOrder :=order_id FROM `order` WHERE cart_id = orderCartId;
   INSERT INTO `sell` (`date_time`, `order_id`, `delivery_state`, `payment_state`) VALUES (sellDateTime, @newOrder, 'PROCESSING', sellPaymentStatus);
   CALL update_product_variants_quantity_from_cart(orderCartId);
   UPDATE `cart` SET `state` = 'INACTIVE', customer_id = orderCustomerId WHERE `cart`.`cart_id` = orderCartId;
 SET orderIdOutput = @newOrder;
 COMMIT;
 SELECT orderIdOutput;
 END$$

CREATE PROCEDURE `order_transaction_guest` (IN `orderCartId` INT(10), IN `orderDate` DATETIME, IN `orderName` VARCHAR(255), IN `orderAddress` VARCHAR(255), IN `orderZipcode` VARCHAR(10), IN `orderPhoneNumber` VARCHAR(255), IN `orderDeliveryMethod` ENUM('STORE-PICKUP','DELIVERY'), IN `orderPaymentMethod` ENUM('CASH','CARD'), IN `orderCustomerId` INT(10), IN `sellDateTime` DATETIME, IN `sellPaymentStatus` ENUM('PENDING','PAID'), OUT `orderIdOutput` INT(10))  BEGIN
 

 START TRANSACTION;
   INSERT INTO `order` (`customer_id`, `cart_id`, `date`, `order_name`, `delivery_address`,`zip_code`, `phone_number`, `delivery_method`, `payment_method`) VALUES (NULL, orderCartId, orderDate, orderName, orderAddress, orderZipcode, orderPhoneNumber, orderDeliveryMethod, orderPaymentMethod);
   SELECT @newOrder :=order_id FROM `order` WHERE cart_id = orderCartId;
   INSERT INTO `sell` (`date_time`, `order_id`, `delivery_state`, `payment_state`) VALUES (sellDateTime, @newOrder, 'PROCESSING', sellPaymentStatus);
   CALL update_product_variants_quantity_from_cart(orderCartId);
   UPDATE `cart` SET `state` = 'INACTIVE' WHERE `cart`.`cart_id` = orderCartId;
 SET orderIdOutput = @newOrder;
 COMMIT;
 SELECT orderIdOutput;
 END$$

CREATE PROCEDURE `update_product_variants_quantity_from_cart` (IN `cartId` INT)  BEGIN  
	DECLARE i INT DEFAULT 0;
	SELECT @n:=COUNT(*) FROM `variant` NATURAL JOIN cart_product WHERE cart_id=cartId;
	SET i=0;
	WHILE i<@n DO 
  		SELECT @variantId := variant_id FROM (SELECT ROW_NUMBER()OVER(ORDER BY variant_id)-1 as e , variant_id,quantity-CAST( number_of_items AS SIGNED ) remainder  FROM `variant` NATURAL JOIN cart_product WHERE cart_id=cartId) as A WHERE A.e=i LIMIT 1;
        SELECT @qval := number_of_items FROM (SELECT ROW_NUMBER()OVER(ORDER BY variant_id)-1 as e , variant_id, number_of_items FROM `variant` NATURAL JOIN cart_product WHERE cart_id=cartId) as A WHERE A.e=i LIMIT 1;
        UPDATE `variant` SET `quantity` = quantity-CAST( @qval AS SIGNED ) WHERE `variant`.`variant_id` = @variantId;
  		SET i = i + 1;
	END WHILE;
END$$

CREATE PROCEDURE max_sales (IN start_date datetime , IN end_date datetime , IN no_of_rows int(3))
    BEGIN
        select product_title, sum(number_of_items) as sales from items where date_time between start_date and end_date
        group by product_title order by sales desc limit no_of_rows ;
END$$

DELIMITER ;

create table if not exists admin (
    admin_id int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(1024) NOT NULL
);

create table if not exists customer (
    customer_id int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(1024) NOT NULL
);



create table if not exists customer_address (
    address_id int unsigned AUTO_INCREMENT PRIMARY KEY,
    customer_id int unsigned NOT NULL,
    po_box varchar(255),
    street_name varchar(255),
    city varchar(255),
    postal_code varchar(255),
    foreign key (customer_id) references customer(customer_id) on delete cascade
);



create table if not exists customer_mobile (
    telephone_id int unsigned auto_increment primary key,
    customer_id int unsigned not null,
    mobile varchar(20),
    foreign key (customer_id) references customer(customer_id) on delete cascade
);



create table if not exists category(
    category_id     int unsigned    auto_increment  primary key,
    category_name   varchar(255)    not null
);



create table if not exists sub_category(
    sub_category_id     int unsigned    auto_increment  primary key,
    sub_category_name   varchar(255)    not null
);



create table if not exists category_link(
    category_id         int unsigned    not null,
    sub_category_id     int unsigned    not null,

    primary key (category_id, sub_category_id),

    foreign key (category_id)       references      category(category_id)           on delete cascade,
    foreign key (sub_category_id)   references      sub_category(sub_category_id)   on delete cascade
);



create table if not exists product (
    product_id          int unsigned                        auto_increment  primary key,
    product_title       varchar(255)                        not null,
    sku                 varchar(32)                         not null,
    product_weight      float                               not null,
    default_variant_id  int unsigned,
    image_name          varchar(255),
    availability        enum('AVAILABLE', 'UNAVAILABLE')    not null        default 'AVAILABLE'
);



create table if not exists product_category (
    product_id          int unsigned    not null,
    category_id         int unsigned    not null,
    sub_category_id     int unsigned    not null,

    primary key (product_id, category_id, sub_category_id),

    foreign key (product_id)        references      product(product_id)             on delete cascade,
    foreign key (category_id)       references      category(category_id)           on delete cascade,
    foreign key (sub_category_id)   references      sub_category(sub_category_id)   on delete cascade
);



create table if not exists custom_feature (
    custom_feature_id       int unsigned    auto_increment primary key,
    product_id              int unsigned    not null,
    custom_feature_name     varchar(255)    not null,
    custom_feature_val      varchar(255)    not null,

    foreign key (product_id)    references      product(product_id)     on delete cascade
);



create table if not exists variant (
    variant_id      int unsigned    auto_increment  primary key,
    product_id      int unsigned    not null,
    variant_name    varchar(255)    not null,
    price           decimal(15, 2)  not null,
    quantity        int             not null,

    foreign key (product_id)    references      product(product_id)     on delete cascade
);



create table if not exists variant_option (
    option_id       int unsigned    auto_increment  primary key,
    product_id      int unsigned    not null,
    option_name     varchar(255),

    foreign key (product_id)    references      product(product_id)     on delete cascade
);



create table if not exists variant_option_values (
    value_id        int unsigned    auto_increment      primary key,
    product_id      int unsigned    not null,
    option_id       int unsigned    not null,
    value_name      varchar(255)    not null,

    foreign key (product_id)    references  product(product_id)         on delete cascade,
    foreign key (option_id)     references  variant_option(option_id)   on delete cascade
);


create table if not exists variant_values (
    product_id      int unsigned    not null,
    variant_id      int unsigned    not null,
    option_id       int unsigned    not null,
    value_id        int unsigned    not null,

    primary key (product_id, variant_id, option_id, value_id),

    foreign key (product_id)    references      product(product_id)                 on delete cascade,
    foreign key (variant_id)    references      variant(variant_id)                 on delete cascade,
    foreign key (option_id)     references      variant_option(option_id)           on delete cascade,
    foreign key (value_id)      references      variant_option_values(value_id)     on delete cascade
);



create table if not exists variant_image (
    variant_id      int unsigned    not null,
    image_name      varchar(255)    primary key,

    foreign key (variant_id)    references      variant(variant_id)     on delete cascade
);



create table if not exists cart(
    cart_id         int unsigned    auto_increment      primary key,
    customer_id     int unsigned ,
    state           enum('ACTIVE', 'INACTIVE')    not null ,
    foreign key     (customer_id)        references         customer(customer_id)     on delete cascade
);



create table if not exists cart_product(
    cart_id int unsigned,
    variant_id int unsigned,
    number_of_items int unsigned,
    primary key (cart_id, variant_id),
    foreign key (cart_id) references cart(cart_id) on delete cascade,
    foreign key (variant_id) references variant(variant_id) on delete cascade
);



create table if not exists `order`(
    order_id int unsigned auto_increment primary key,
    customer_id int unsigned,
    cart_id int unsigned not null,
    date datetime not null,
    order_name varchar(255),
    delivery_address varchar(255),
    zip_code varchar(10),
    phone_number varchar(255),
    delivery_method enum('STORE-PICKUP', 'DELIVERY') not null,
    payment_method enum('CASH', 'CARD') not null,
    foreign key (cart_id) references cart(cart_id) on delete cascade,
    foreign key (customer_id) references customer(customer_id) on delete cascade
);



create table if not exists sell(
    sell_id int unsigned auto_increment primary key,
    date_time datetime,
    order_id int unsigned not null,
    delivery_state enum('PROCESSING', 'OUT-FOR-DELIVERY', 'DELIVERED') not null default 'PROCESSING',
    payment_state enum('PENDING', 'PAID'),
    foreign key (order_id) references `order`(order_id) on delete cascade
);


alter table product
    add constraint FK_Product_DefaultVariant
        foreign key (default_variant_id)
        references variant(variant_id);

create view items as  select p.product_title, v.variant_name, cp.number_of_items ,s. date_time
                      from sell s join `order` o using (order_id)
                                  join cart_product cp using(cart_id)
                                  join variant v using (variant_id)
                                  join product p using(product_id)
                                  where s.payment_state = 'PAID' ;
