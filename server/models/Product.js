const _ = require("lodash");
const Joi = require("joi");
const db = require("../util/database");
const dotenv = require("dotenv");
dotenv.config();

class Product {
    constructor(productDetails) {
        this.product_id = productDetails.product_id;
        this.product_title = productDetails.product_title;
        this.sku = productDetails.sku;
        this.product_weight = productDetails.product_weight;
        this.custom_features = productDetails.custom_features;
        this.options = productDetails.options;
        this.product_categories = productDetails.product_categories;
    }

    static #schema = {
        product_id: Joi.number().min(1).label("Product ID"),
        product_title: Joi.string()
            .required()
            .min(3)
            .max(250)
            .label("Product Title"),
        sku: Joi.string().required().min(5).max(30).label("SKU"),
        product_weight: Joi.number().required().min(1).label("Product Weight"),
        custom_features: Joi.array(),
        product_categories: Joi.array(),
        options: Joi.array(),
        isNew: Joi.bool(),
        image_name: Joi.string().allow(""),
    };

    static fetchAll() {
        const select_all_query = `
            select
                *
            from
                product p
                join variant v on p.default_variant_id = v.variant_id
            where
                p.availability = 'AVAILABLE'
                and p.product_id in (
                    select
                        distinct product_id
                    from
                        product_category
                )
        `;

        return db.execute(select_all_query);
    }

    static fetchUnavailable() {
        const select_unavailable_query = `
            select
                product_id,
                product_title,
                sku,
                availability,
                default_variant_id
            from
                product
            where
                availability = 'UNAVAILABLE'
               or default_variant_id is null
               or product_id not in (
                select
                    distinct product_id
                from product_category
            )
        `;

        return db.execute(select_unavailable_query);
    }

    static async getProductById(productId) {
        const product = await Product.getProduct(productId);

        if (product) {
            product.custom_features = await Product.getCustomFeatures(
                productId
            );
            product.product_categories =
                await Product.getProductCategoriesWithNames(productId);
            product.options = await Product.getOptions(productId);
        }

        return product;
    }

    static async getProduct(productId) {
        const get_product_query = `
            select
                *
            from
                product p
                left outer join variant v on p.default_variant_id = v.variant_id
            where
                p.product_id = ?
        `;

        const [products, _] = await db.execute(get_product_query, [productId]);

        if (products.length > 0) {
            const product = products[0];
            product.product_categories =
                Product.getProductCategoriesWithNames(productId);
            return product;
        }

        return false;
    }

    static async getCustomFeatures(productId) {
        const get_custom_features_query = `
            select
                custom_feature_id,
                custom_feature_name,
                custom_feature_val
            from
                custom_feature
            where
                product_id = ?
        `;

        const [custom_features, _] = await db.execute(
            get_custom_features_query,
            [productId]
        );
        return custom_features;
    }

    static async getProductCategories(productId) {
        const get_product_categories_query = `
            select
                category_id,
                sub_category_id
            from
                product_category
            where
                product_id = ?
        `;

        const [product_categories, _] = await db.execute(
            get_product_categories_query,
            [productId]
        );
        return product_categories;
    }

    static async getProductCategoriesWithNames(productId) {
        const get_product_categories_names_query = `
            select
                pc.category_id,
                pc.sub_category_id,
                c.category_name,
                sc.sub_category_name
            from
                product_category pc
                join
                    category c
                    on pc.category_id = c.category_id
                left outer join
                    sub_category sc
                    on pc.sub_category_id = sc.sub_category_id
            where
                pc.product_id = ?
        `;

        const [product_categories, _] = await db.execute(
            get_product_categories_names_query,
            [productId]
        );
        return product_categories;
    }

    static async getOptionValues(productId, optionId) {
        const get_option_values_query = `
            select
                value_id,
                value_name
            from
                variant_option_values
            where
                product_id = ?
                and option_id=?
        `;

        const option_values = await db.execute(get_option_values_query, [
            productId,
            optionId,
        ]);
        return option_values[0];
    }

    static async getOptions(productId) {
        const get_options_query = `
            select
                option_id,
                option_name
            from
                variant_option
            where
                product_id = ?
        `;

        let options = await db.execute(get_options_query, [productId]);
        options = options[0];
        for (const option of options) {
            option.values = await this.getOptionValues(
                productId,
                option.option_id
            );
        }
        return options;
    }

    static async getCustomFeature(customFeatureId) {
        const get_custom_feature_query = `
            select
                *
            from
                custom_feature
            where
                custom_feature_id = ?
        `;

        const [customFeature, _] = await db.execute(get_custom_feature_query, [
            customFeatureId,
        ]);
        return customFeature[0];
    }

    static async addCustomFeature(productId, customFeature) {
        const insert_custom_feature_query = `
            insert into custom_feature (product_id, custom_feature_name, custom_feature_val)
            values (?, ?, ?)
        `;

        const result = await db.execute(insert_custom_feature_query, [
            productId,
            customFeature.custom_feature_name,
            customFeature.custom_feature_val,
        ]);
        customFeature.custom_feature_id = result[0].insertId;
    }

    static async addProductCategory(productId, productCategory) {
        const insert_product_category_query = `
            insert into product_category (product_id, category_id, sub_category_id)
            values (?, ?, ?)
        `;

        await db.execute(insert_product_category_query, [
            productId,
            productCategory.category_id,
            productCategory.sub_category_id,
        ]);
    }

    static async addProductCategoryDefault(productId, categoryId) {
        const insert_product_category_default_query = `
            insert into product_category (product_id, category_id)
            values (?, ?)
        `;

        await db.execute(insert_product_category_default_query, [
            productId,
            categoryId,
        ]);
    }

    static async updateCustomFeature(customFeature) {
        const { custom_feature_id, custom_feature_name, custom_feature_val } =
            customFeature;
        const { custom_feature_name: old_name, custom_feature_val: old_val } =
            await Product.getCustomFeature(custom_feature_id);

        if (
            custom_feature_name !== old_name ||
            custom_feature_val !== old_val
        ) {
            const update_custom_feature_query = `
                update
                    custom_feature
                set
                    custom_feature_name = ?,
                    custom_feature_val = ?
                where
                    custom_feature_id = ?
            `;

            await db.execute(update_custom_feature_query, [
                custom_feature_name,
                custom_feature_val,
                custom_feature_id,
            ]);
        }
    }

    async save() {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();
            await this.saveProduct(connection);
            await this.saveProductCategories(connection);
            await this.saveCustomFeatures(connection);
            await this.saveOptions(connection);
            await connection.commit();
        } catch (e) {
            await connection.rollback();
            await connection.release();
            throw e;
        }

        await connection.release();
    }

    async saveProduct(connection) {
        const insert_product_query = `
            insert into product (product_title, sku, product_weight)
            values (?, ?, ?)
        `;

        const result = await connection.execute(insert_product_query, [
            this.product_title,
            this.sku,
            this.product_weight,
        ]);
        this.product_id = result[0].insertId;
        connection.unprepare(insert_product_query);
    }

    async saveProductCategories(connection) {
        for (const { category_id, sub_category_id } of this
            .product_categories) {
            if (sub_category_id) {
                const insert_product_category_query = `
                insert into product_category (product_id, category_id, sub_category_id)
                values (?, ?, ?)
            `;

                await connection.execute(insert_product_category_query, [
                    this.product_id,
                    category_id,
                    sub_category_id,
                ]);
                connection.unprepare(insert_product_category_query);
            } else {
                const insert_product_category_default_query = `
                insert into product_category (product_id, category_id)
                values (?, ?)
            `;

                await connection.execute(
                    insert_product_category_default_query,
                    [this.product_id, category_id]
                );
                connection.unprepare(insert_product_category_default_query);
            }
        }
    }

    async saveCustomFeatures(connection) {
        for (const custom_feature of this.custom_features) {
            const insert_custom_feature_query = `
                insert into custom_feature (product_id, custom_feature_name, custom_feature_val)
                values (?, ?, ?)
            `;

            const result = await connection.execute(
                insert_custom_feature_query,
                [
                    this.product_id,
                    custom_feature.custom_feature_name,
                    custom_feature.custom_feature_val,
                ]
            );
            custom_feature.custom_feature_id = result[0].insertId;
            connection.unprepare(insert_custom_feature_query);
        }
    }

    async saveOptions(connection) {
        for (const option of this.options) {
            const insert_option_query = `
                insert into variant_option (product_id, option_name)
                values (?, ?)
            `;

            const result = await connection.execute(insert_option_query, [
                this.product_id,
                option.option_name,
            ]);
            option.option_id = result[0].insertId;
            connection.unprepare(insert_option_query);

            for (const value of option.values) {
                const insert_value_query =
                    "insert into variant_option_values (product_id, option_id, value_name) values (?, ?, ?)";
                const result = await connection.execute(insert_value_query, [
                    this.product_id,
                    option.option_id,
                    value.value_name,
                ]);
                value.value_id = result[0].insertId;
                connection.unprepare(insert_value_query);
            }
        }
    }

    async update() {
        const {
            product_title: old_title,
            sku: old_sku,
            product_weight: old_weight,
        } = Product.getProduct(this.product_id);

        if (
            this.product_title !== old_title ||
            this.sku !== old_sku ||
            this.product_weight !== old_weight
        ) {
            const update_product_query = `
                update
                    product
                set
                    product_title = ?,
                    sku = ?,
                    product_weight = ?
                where
                    product_id = ?
            `;

            await db.execute(update_product_query, [
                this.product_title,
                this.sku,
                this.product_weight,
                this.product_id,
            ]);
        }
    }

    static async makeDefault(productId, variantId) {
        const make_default_query = `
            update
                product
            set
                default_variant_id = ?
            where product_id = ?
        `;

        await db.execute(make_default_query, [variantId, productId]);
    }

    static async saveProductImage(productId, imageName) {
        const save_image_query = `
            update
                product
            set
                image_name = ?
            where
                product_id = ?
        `;

        await db.execute(save_image_query, [imageName, productId]);
    }

    static async deleteCustomFeature(featureId) {
        const delete_custom_feature_query = `
            delete
                from custom_feature
                where custom_feature_id = ?
        `;

        await db.execute(delete_custom_feature_query, [featureId]);
    }

    static async deleteProductCategory(productId, categoryId, subCategoryId) {
        const delete_product_category_query = `
            delete
                from product_category
                where
                    product_id = ?
                    and category_id = ?
                    and sub_category_id = ?
        `;

        await db.execute(delete_product_category_query, [
            productId,
            categoryId,
            subCategoryId,
        ]);
    }

    static async deleteProductCategoryDefault(productId, categoryId) {
        const delete_product_category_default_query = `
            delete
                from product_category
                where
                    product_id = ?
                    and category_id = ?
                    and sub_category_id is null
        `;

        await db.execute(delete_product_category_default_query, [
            productId,
            categoryId,
        ]);
    }

    static async deleteProduct(productId) {
        const delete_product_query = `
            update
                product
            set
                availability = 'UNAVAILABLE'
            where
                product_id = ?
        `;

        await db.execute(delete_product_query, [productId]);
    }

    static async restoreProduct(productId) {
        const restore_product_query = `
            update
                product
            set
                availability = 'AVAILABLE'
            where
                product_id = ?
        `;

        await db.execute(restore_product_query, [productId]);
    }

    static async checkProductVariant(productId, variantId) {
        const check_query = `
            select
                variant_id
            from
                variant
            where
                variant_id = ?
                and product_id = ?
        `;

        const [result, _] = await db.execute(check_query, [
            variantId,
            productId,
        ]);
        return result.length > 0;
    }

    static getSchema() {
        return Product.#schema;
    }
}

function validateProductId(productId) {
    const { error } = Joi.object({
        id: Joi.number().required().min(1).label("Product ID"),
    }).validate({ id: productId });

    return error;
}

function validateProduct(product, props) {
    const schema = _.pick(Product.getSchema(), props);
    const object = _.pick(product, props);

    return Joi.object(schema).validate(object);
}

function validateCustomFeature(feature) {
    const schema = {
        custom_feature_name: Joi.string()
            .required()
            .min(3)
            .max(100)
            .label("Custom Feature Name"),
        custom_feature_val: Joi.string()
            .required()
            .min(3)
            .max(250)
            .label("Custom Feature Value"),
    };

    return Joi.object(schema).validate(
        _.pick(feature, "custom_feature_name", "custom_feature_val")
    );
}

function validateProductCategory(productCategory) {
    const schema = {
        category_id: Joi.number().min(1),
        sub_category_id: Joi.number().min(1),
    };

    return Joi.object(schema).validate(
        _.pick(productCategory, ["category_id", "sub_category_id"])
    );
}

function validateOption(option) {
    const schema = {
        option_name: Joi.string()
            .required()
            .min(3)
            .max(250)
            .label("Option Name"),
        values: Joi.array().items(Joi.object({ value_name: Joi.string() })),
    };

    return Joi.object(schema).validate(
        _.pick(option, ["option_name", "values"])
    );
}

module.exports.Product = Product;
module.exports.validateProductId = validateProductId;
module.exports.validateProduct = validateProduct;
module.exports.validateCustomFeature = validateCustomFeature;
module.exports.validateProductCategory = validateProductCategory;
module.exports.validateOption = validateOption;
