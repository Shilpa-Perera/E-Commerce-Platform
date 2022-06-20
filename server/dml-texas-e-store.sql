use texas_e_store;

# admin

INSERT INTO admin (name, email, password)
VALUES (
    'Achira',
    'achira@gmail.com',
    '$2b$10$T98uZ8xm/c7GACggl/w5Re3KwBTwISbpBYYG1p9MyXi1A6njuc9ka'
  );

INSERT INTO admin (name, email, password)
VALUES (
    'Chaturanga',
    'chathuranga@gmail.com',
    '$2b$10$T98uZ8xm/c7GACggl/w5Re3KwBTwISbpBYYG1p9MyXi1A6njuc9ka'
  );

INSERT INTO admin (name, email, password)
VALUES (
    'Sasitha',
    'sasitha@gmail.com',
    '$2b$10$T98uZ8xm/c7GACggl/w5Re3KwBTwISbpBYYG1p9MyXi1A6njuc9ka'
  );

INSERT INTO admin (name, email, password)
VALUES (
    'Thamindu',
    'thamindu@gmail.com',
    '$2b$10$T98uZ8xm/c7GACggl/w5Re3KwBTwISbpBYYG1p9MyXi1A6njuc9ka'
  );

INSERT INTO admin (name, email, password)
VALUES (
    'Shilpa',
    'shilpa@gmail.com',
    '$2b$10$T98uZ8xm/c7GACggl/w5Re3KwBTwISbpBYYG1p9MyXi1A6njuc9ka'
  );

# customer

INSERT INTO customer (name, email, password)
 VALUES (
     'Sahan Silva',
     'sahan@gmail.com',
     '$2b$10$XJTjhQfCLlg4sCrakL.ih.DaeXTb7SjrltITr/x4WgscUubBDDMRq'
   );

 INSERT INTO customer (name, email, password)
 VALUES (
     'Nipuni Silva',
     'nipuni@gmail.com',
     '$2b$10$XJTjhQfCLlg4sCrakL.ih.DaeXTb7SjrltITr/x4WgscUubBDDMRq'
   );

 INSERT INTO customer (name, email, password)
 VALUES (
     'Kumesh Uminda',
     'kumesh@gmail.com',
     '$2b$10$TtrjJrQQn0LkvNJc3wUxLeWmWgji3b23Jq4rgIbzDJ39VauVTR5Zy'
   );



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

insert into sub_category(sub_category_name) values ('Apple');
insert into sub_category(sub_category_name) values ('Nikon');
insert into sub_category(sub_category_name) values ('SanDisk');
insert into sub_category(sub_category_name) values ('Transcend');
insert into sub_category(sub_category_name) values ('Samsung');
insert into sub_category(sub_category_name) values ('Nokia');
insert into sub_category(sub_category_name) values ('Hp');
insert into sub_category(sub_category_name) values ('Asus');
insert into sub_category(sub_category_name) values ('Acer');
insert into sub_category(sub_category_name) values ('Huawei');


insert into category_link (category_id, sub_category_id) values (1,1);
insert into category_link (category_id, sub_category_id) values (1,5);
insert into category_link (category_id, sub_category_id) values (1,6);
insert into category_link (category_id, sub_category_id) values (1,10);
insert into category_link (category_id, sub_category_id) values (2,1);
insert into category_link (category_id, sub_category_id) values (2,5);
insert into category_link (category_id, sub_category_id) values (3,1);
insert into category_link (category_id, sub_category_id) values (3,8);
insert into category_link (category_id, sub_category_id) values (3,9);
insert into category_link (category_id, sub_category_id) values (4,2);
insert into category_link (category_id, sub_category_id) values (6, 1);
insert into category_link (category_id, sub_category_id) values (3, 7);


