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

INSERT INTO users (name, email, password, gender)
VALUES (
    'Chaturanga Jayanath',
    'chathuranga@gmail.com',
    '$2b$10$T98uZ8xm/c7GACggl/w5Re3KwBTwISbpBYYG1p9MyXi1A6njuc9ka',
    'male'
  );

INSERT INTO users (name, email, password, gender)
VALUES (
    'Nipuni Silva',
    'nipuni@gmail.com',
    '$2b$10$XJTjhQfCLlg4sCrakL.ih.DaeXTb7SjrltITr/x4WgscUubBDDMRq',
    'female'
  );

INSERT INTO users (name, email, password, gender)
VALUES (
    'Kumesh Uminda',
    'kumesh@gmail.com',
    '$2b$10$TtrjJrQQn0LkvNJc3wUxLeWmWgji3b23Jq4rgIbzDJ39VauVTR5Zy',
    'male'
  );