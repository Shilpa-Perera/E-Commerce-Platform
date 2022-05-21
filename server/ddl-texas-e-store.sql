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
