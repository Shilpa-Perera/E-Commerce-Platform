use texas_e_store;

# users

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


# Product 1 - iPhone X

insert into product (product_title, sku, product_weight)
values ('iPhone X', '0123456789', 174);

insert into custom_feature (product_id, custom_feature_name, custom_feature_val)
values (1, 'Chipset', 'Apple A11 Bionic');

insert into custom_feature (product_id, custom_feature_name, custom_feature_val)
values (1, 'OS', 'iOS11.1.1, upgradable to iOS 15.5');

insert into custom_feature (product_id, custom_feature_name, custom_feature_val)
values (1, 'Dimensions', '143.6 x 70.9 x 7.7 mm');

insert into custom_feature (product_id, custom_feature_name, custom_feature_val)
values (1, 'Network', 'GSM/HSPA/LTE');

insert into custom_feature (product_id, custom_feature_name, custom_feature_val)
values (1, 'Display', 'Super Retina OLED, 5.8 inches, 1125 x 2436 pixels, 19.5:9 aspect ratio, ~458 ppi density');

insert into variant_option(product_id, option_name)
values (1, 'Color');

insert into variant_option(product_id, option_name)
values (1, 'Storage');

insert into variant_option_values(product_id, option_id, value_name)
values (1, 1, 'Red');

insert into variant_option_values(product_id, option_id, value_name)
values (1, 1, 'Blue');

insert into variant_option_values(product_id, option_id, value_name)
values (1, 2, '64GB');

insert into variant_option_values(product_id, option_id, value_name)
values (1, 2, '128GB');

insert into variant(product_id, variant_name, price, quantity)
values (1, 'Red - 64GB', 300000, 100);

insert into variant(product_id, variant_name, price, quantity)
values (1, 'Red - 128GB', 350000, 88);

insert into variant(product_id, variant_name, price, quantity)
values (1, 'Blue - 64GB', 295000, 72);

insert into variant(product_id, variant_name, price, quantity)
values (1, 'Blue - 128GB', 345000, 21);

insert into variant_values(product_id, variant_id, option_id, value_id)
values (1, 1, 1, 1);

insert into variant_values(product_id, variant_id, option_id, value_id)
values (1, 1, 2, 3);

insert into variant_values(product_id, variant_id, option_id, value_id)
values (1, 2, 1, 1);

insert into variant_values(product_id, variant_id, option_id, value_id)
values (1, 2, 2, 4);

insert into variant_values(product_id, variant_id, option_id, value_id)
values (1, 3, 1, 2);

insert into variant_values(product_id, variant_id, option_id, value_id)
values (1, 3, 2, 3);

insert into variant_values(product_id, variant_id, option_id, value_id)
values (1, 4, 1, 2);

insert into variant_values(product_id, variant_id, option_id, value_id)
values (1, 4, 2, 4);
