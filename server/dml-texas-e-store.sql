use texas_e_store;

# admin

INSERT INTO admin (name, email, password) values  ('Achira', 'achira@gmail.com', '$2b$10$T98uZ8xm/c7GACggl/w5Re3KwBTwISbpBYYG1p9MyXi1A6njuc9ka');
INSERT INTO admin (name, email, password) values ('Chaturanga', 'chathuranga@gmail.com', '$2b$10$T98uZ8xm/c7GACggl/w5Re3KwBTwISbpBYYG1p9MyXi1A6njuc9ka');
INSERT INTO admin (name, email, password) values ('Sasitha', 'sasitha@gmail.com', '$2b$10$T98uZ8xm/c7GACggl/w5Re3KwBTwISbpBYYG1p9MyXi1A6njuc9ka');
INSERT INTO admin (name, email, password) values ('Thamindu', 'thamindu@gmail.com', '$2b$10$T98uZ8xm/c7GACggl/w5Re3KwBTwISbpBYYG1p9MyXi1A6njuc9ka');
INSERT INTO admin (name, email, password) values ('Shilpa', 'shilpa@gmail.com', '$2b$10$T98uZ8xm/c7GACggl/w5Re3KwBTwISbpBYYG1p9MyXi1A6njuc9ka');

#categories

insert into category(category_name) values ('Mobiles');
insert into category(category_name) values ('Tablets');
insert into category(category_name) values ('Laptops');
insert into category(category_name) values ('Cameras');
insert into category(category_name) values ('Monitors');
insert into category(category_name) values ('Smart Watches');
insert into category(category_name) values ('External Storages');
insert into category(category_name) values ('Desktops');
insert into category(category_name) values ('Smart TVs');
insert into category(category_name) values ('Routers');
insert into category(category_name) values ('Power Banks');
insert into category(category_name) values ('Keyboards');
insert into category(category_name) values ('Memory Cards');
insert into category(category_name) values ('Mice');
insert into category(category_name) values ('Printers');

insert into sub_category (sub_category_name) values ('Apple');
insert into sub_category (sub_category_name) values ('Nikon');
insert into sub_category (sub_category_name) values ('SanDisk');
insert into sub_category (sub_category_name) values ('Transcend');
insert into sub_category (sub_category_name) values ('Samsung');
insert into sub_category (sub_category_name) values ('Nokia');
insert into sub_category (sub_category_name) values ('Hp');
insert into sub_category (sub_category_name) values ('Asus');
insert into sub_category (sub_category_name) values ('Acer');
insert into sub_category (sub_category_name) values ('Huawei');
insert into sub_category (sub_category_name) values ('ZTE');
insert into sub_category (sub_category_name) values ('PROLiNK');
insert into sub_category (sub_category_name) values ('Wireless');
insert into sub_category (sub_category_name) values ('4 G');
insert into sub_category (sub_category_name) values ('ADSL');
insert into sub_category (sub_category_name) values ('Gaming');

insert into category_link (category_id, sub_category_id) values (1, 1);
insert into category_link (category_id, sub_category_id) values (2, 1);
insert into category_link (category_id, sub_category_id) values (3, 1);
insert into category_link (category_id, sub_category_id) values (6, 1);
insert into category_link (category_id, sub_category_id) values (8, 1);
insert into category_link (category_id, sub_category_id) values (9, 1);
insert into category_link (category_id, sub_category_id) values (12, 1);
insert into category_link (category_id, sub_category_id) values (14, 1);
insert into category_link (category_id, sub_category_id) values (4, 2);
insert into category_link (category_id, sub_category_id) values (7, 3);
insert into category_link (category_id, sub_category_id) values (13, 3);
insert into category_link (category_id, sub_category_id) values (7, 4);
insert into category_link (category_id, sub_category_id) values (13, 4);
insert into category_link (category_id, sub_category_id) values (1, 5);
insert into category_link (category_id, sub_category_id) values (2, 5);
insert into category_link (category_id, sub_category_id) values (5, 5);
insert into category_link (category_id, sub_category_id) values (6, 5);
insert into category_link (category_id, sub_category_id) values (7, 5);
insert into category_link (category_id, sub_category_id) values (8, 5);
insert into category_link (category_id, sub_category_id) values (9, 5);
insert into category_link (category_id, sub_category_id) values (14, 5);
insert into category_link (category_id, sub_category_id) values (1, 6);
insert into category_link (category_id, sub_category_id) values (9, 6);
insert into category_link (category_id, sub_category_id) values (3, 7);
insert into category_link (category_id, sub_category_id) values (5, 7);
insert into category_link (category_id, sub_category_id) values (8, 7);
insert into category_link (category_id, sub_category_id) values (12, 7);
insert into category_link (category_id, sub_category_id) values (14, 7);
insert into category_link (category_id, sub_category_id) values (15, 7);
insert into category_link (category_id, sub_category_id) values (3, 8);
insert into category_link (category_id, sub_category_id) values (5, 8);
insert into category_link (category_id, sub_category_id) values (8, 8);
insert into category_link (category_id, sub_category_id) values (12, 8);
insert into category_link (category_id, sub_category_id) values (14, 8);
insert into category_link (category_id, sub_category_id) values (3, 9);
insert into category_link (category_id, sub_category_id) values (5, 9);
insert into category_link (category_id, sub_category_id) values (8, 9);
insert into category_link (category_id, sub_category_id) values (12, 9);
insert into category_link (category_id, sub_category_id) values (14, 9);
insert into category_link (category_id, sub_category_id) values (1, 10);
insert into category_link (category_id, sub_category_id) values (2, 10);
insert into category_link (category_id, sub_category_id) values (10, 11);
insert into category_link (category_id, sub_category_id) values (10, 12);
insert into category_link (category_id, sub_category_id) values (10, 13);
insert into category_link (category_id, sub_category_id) values (10, 14);
insert into category_link (category_id, sub_category_id) values (10, 15);
insert into category_link (category_id, sub_category_id) values (8, 16);


