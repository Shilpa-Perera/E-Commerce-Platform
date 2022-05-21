create database if not exists texas_e_store;
use texas_e_store;

drop table if exists users;
create table if not exists users (
    id int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(1024) NOT NULL,
    gender VARCHAR(8) NOT NULL
);

drop table if exists product;
create table if not exists product (
    product_id int unsigned auto_increment primary key,
    product_title varchar(255) not null,
    sku varchar(32) not null,
    product_weight float not null
);

drop table if exists custom_feature;
create table if not exists custom_feature (
    custom_feature_id int unsigned auto_increment primary key,
    product_id int unsigned not null,
    custom_feature_name varchar(255) not null,
    custom_feature_val varchar(255) not null
);

drop table if exists variant;
create table if not exists variant (
    variant_id int unsigned auto_increment primary key,
    product_id int unsigned not null,
    variant_name varchar(255) not null,
    price decimal(15, 2) not null,
    quantity int not null,
    foreign key (product_id) references product(product_id)
);

drop table if exists variant_option;
create table if not exists variant_option (
    option_id int unsigned auto_increment primary key,
    product_id int unsigned not null,
    variant_name varchar(255),
    foreign key (product_id) references product(product_id)
);
