const ROLE = require("../util/roles.json");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const db = require("../util/database");
require("dotenv").config();
const config = require("config");

class CustomerAddress {
    constructor(customerAddressDetails) {
        this.address_id = customerAddressDetails.address_id;
        this.customer_id = customerAddressDetails.customer_id;
        this.po_box = customerAddressDetails.po_box;
        this.street_name = customerAddressDetails.street_name;
        this.city = customerAddressDetails.city;
        this.postal_code = customerAddressDetails.postal_code;
    }

    static async getById(addressId) {
        const sql = "select * from customer_address where address_id=?";

        const [addresses, _] = await db.execute(sql, [addressId]);
        return new CustomerAddress(addresses[0]);
    }

    static async deleteById(addressId) {
        let sql = "delete from customer_address where address_id=?";

        const result = await db.execute(sql, [addressId], (err, results) => {
            if (err) {
                throw err;
            } else {
                console.log("results: ", results);
            }
        });
        return result;
    }

    async update() {
        let sql =
            "update customer_address \
    set po_box=?, street_name=?, city=?, postal_code=? where customer_id=? and address_id=?;";

        await db.execute(
            sql,
            [
                this.po_box,
                this.street_name,
                this.city,
                this.postal_code,
                this.customer_id,
                this.address_id,
            ],
            (err, results) => {
                if (err) {
                    throw err;
                } else {
                    console.log("results: ", results);
                }
            }
        );
    }

    async save() {}

    static async getAddressesById(customerId) {
        const get_address_query = `
            select
                *
            from
                customer_address
            where
                customer_id = ?
        `;

        const [addresses, _] = await db.execute(get_address_query, [
            customerId,
        ]);
        return addresses;
    }
}

class CustomerMobile {
    constructor(customerMobileDetails) {
        this.telephone_id = customerMobileDetails.telephone_id;
        this.customer_id = customerMobileDetails.customer_id;
        this.mobile = customerMobileDetails.mobile;
    }

    static async getById(mobileId) {
        const sql = "select * from customer_mobile where telephone_id=?";

        const [mobiles, _] = await db.execute(sql, [mobileId]);
        return new CustomerMobile(mobiles[0]);
    }

    static async deleteById(mobileId) {
        let sql = "delete from customer_mobile where telephone_id=?";

        const result = await db.execute(sql, [mobileId], (err, results) => {
            if (err) {
                throw err;
            } else {
                console.log("results: ", results);
            }
        });
        return result;
    }

    async update() {
        let sql =
            "update customer_mobile \
    set mobile=? where telephone_id=? and customer_id=?;";

        await db.execute(
            sql,
            [this.mobile, this.telephone_id, this.customer_id],
            (err, results) => {
                if (err) {
                    throw err;
                } else {
                    console.log("results: ", results);
                }
            }
        );
    }
}

class Customer {
    constructor(customerDetails) {
        this.customer_id = customerDetails.customer_id;
        this.first_name = customerDetails.first_name;
        this.last_name = customerDetails.last_name;
        this.email = customerDetails.email;
        this.password = customerDetails.password;
        this.mobiles = customerDetails.mobiles;

        this.addresses = [];
    }

    // GET
    static async fetchAll() {
        const [result, _] = await db.execute(
            "select customer_id,first_name,last_name,email from customer"
        );
        return result;
    }

    static async findByEmail(email) {
        let sql = `select * from customer where email=?;`;
        const [customers, _] = await db.execute(sql, [email]);

        return customers.length > 0 ? new Customer(customers[0]) : false;
    }

    static async findById(customerId) {
        const sql = `select * from customer where customer_id=?;`;
        const [customers, _] = await db.execute(sql, [customerId]);
        return customers.length > 0 ? new Customer(customers[0]) : false;
    }

    static async fetchAllInfoById(customerId) {
        const customer = await this.findById(customerId);
        if (!customer) return;

        const addresses = await this.fetchAddresses(customerId);
        customer.addresses = addresses;

        const mobiles = await this.fetchMobiles(customerId);
        customer.mobiles = mobiles;

        return customer;
    }

    static async fetchAddresses(customerId) {
        const sql = "select * from customer_address where customer_id=?";
        const [addresses, _] = await db.execute(sql, [customerId]);

        const result = [];
        for (let address of addresses) {
            result.push(new CustomerAddress(address));
        }
        // console.log("inside fetchAddresses", addresses);
        return result;
    }

    static async fetchMobiles(customerId) {
        const sql = "select * from customer_mobile where customer_id=?";
        const [customer_mobiles, _] = await db.execute(sql, [customerId]);

        const customerMobileObjs = [];
        for (let customerMobileDetails of customer_mobiles)
            customerMobileObjs.push(new CustomerMobile(customerMobileDetails));

        return customerMobileObjs;
    }

    // POST
    // inside awaits should call within a transaction
    async save() {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();
            await this.saveCustomer(connection);
            await this.saveMobiles(connection);
            await this.saveAddresses(connection);
            await connection.commit();
        } catch (ex) {
            await connection.rollback();
            await connection.release();
            throw ex;
        }
        await connection.release();
    }

    generateQueryToSave() {
        let query = "";
        let params = [];

        // query += this.getSaveCustomerQueryWithParams().query;
        // params.push(...this.getSaveCustomerQueryWithParams().params);

        // query += this.getSaveMobilesQueryWithParams().query;
        // params.push(...this.getSaveMobilesQueryWithParams().params);

        // query += this.getSaveAddressesQueryWithParams().query;
        // params.push(...this.getSaveAddressesQueryWithParams().params);
    }

    getSaveMobilesQueryWithParams() {
        let query = "insert into customer_mobile (customer_id,mobile) values ";
        let params = [];

        for (let i = 0; i < this.mobiles.length; i++) {
            const mobile = this.mobiles[i];

            if (mobile.telephone_id !== -1) continue;

            const args = [this.customer_id, mobile.mobile];

            params.push(...args);
        }

        const sql = Array(this.mobiles.length).fill("(?,?)").join(",");
        query += sql;

        return { query: query, params: params };
    }

    getSaveAddressesQueryWithParams() {
        let query =
            "insert into customer_address (customer_id,po_box,street_name,city,postal_code) values ";
        let params = [];

        for (let i = 0; i < this.addresses.length; i++) {
            const address = this.addresses[i];

            if (address.address_id !== -1) continue;

            const args = [
                this.customer_id,
                address.po_box,
                address.street_name,
                address.city,
                address.postal_code,
            ];

            params.push(...args);
        }

        const sql = Array(this.addresses.length).fill("(?,?,?,?,?)").join(",");
        query += sql;

        return { query: query, params: params };
    }

    async updateCustomer() {
        let sql =
            "update customer set first_name=?, last_name=? where customer_id=?;";

        await db.execute(
            sql,
            [this.first_name, this.last_name, this.customer_id],
            (err, results) => {
                if (err) {
                    throw err;
                } else {
                    console.log("results: ", results);
                }
            }
        );
    }

    async saveCustomer(connection) {
        let sql =
            "insert into customer (first_name,last_name,email,password) values (?,?,?,?);";

        const result = await connection.execute(sql, [
            this.first_name,
            this.last_name,
            this.email,
            this.password,
        ]);
        connection.unprepare(sql);
        this.customer_id = result[0].insertId;
    }

    async updateMobiles() {}

    // before executing "cusomter_id" should be SET
    async saveMobiles(connection) {
        // this.mobiles not include "customer_id"

        const query = this.getSaveMobilesQueryWithParams().query;
        const params = this.getSaveMobilesQueryWithParams().params;
        // console.log(query);
        // console.log(params);
        if (!connection) connection = db;

        await connection.execute(query, params, (err, results) => {
            if (err) {
                throw err;
            } else {
                console.log(results);
            }
        });
    }

    // before executing "cusomter_id" should be SET
    async saveAddresses(connection) {
        const query = this.getSaveAddressesQueryWithParams().query;
        const params = this.getSaveAddressesQueryWithParams().params;

        if (!connection) connection = db;

        await connection.execute(query, params, (err, results) => {
            if (err) {
                throw err;
            } else {
                console.log(results);
            }
        });
    }

    async update() {
        await this.updateCustomer();
    }

    generateAuthToken() {
        const token = jwt.sign(
            {
                user_id: this.customer_id,
                first_name: this.first_name,
                last_name: this.last_name,
                email: this.email,
                role: ROLE.CUSTOMER,
            },
            config.get("jwtPrivateKey")
        );
        return token;
    }
}

function validateCustomer(customer) {
    const schema = Joi.object({
        first_name: Joi.string().min(3).max(255).required(),
        last_name: Joi.string().min(3).max(255).required(),
        email: Joi.string().min(5).max(255).required(),
        password: Joi.string().max(1024).required(),
        addresses: Joi.array()
            .items({
                address_id: Joi.number(),
                po_box: Joi.string(),
                street_name: Joi.string(),
                city: Joi.string(),
                postal_code: Joi.number(),
            })
            .required()
            .min(1),
        mobiles: Joi.array()
            .items({
                telephone_id: Joi.number(),
                mobile: Joi.string().regex(
                    /^\+?\d{0,3}\s?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/
                ),
            })
            .required()
            .min(1),
    });

    return schema.validate(customer);
}

function validateCustomerAddress(customerAddress) {
    const schema = Joi.object({
        address_id: Joi.string().min(3).max(255).required(),
        customer_id: Joi.string().min(5).max(255).required(),
        po_box: Joi.string().min(5).max(255),
        street_name: Joi.string().min(5).max(255),
        city: Joi.string().min(5).max(255),
        postal_code: Joi.string().max(1024),
    });

    return schema.validate(customerAddress);
}

function validateCustomerMobile(customerMobile) {
    const schema = Joi.object({
        telephone_id: Joi.string().required(),
        customer_id: Joi.string().required(),
        mobile: Joi.string().min(10).max(12),
    });

    return schema.validate(customerMobile);
}

module.exports.Customer = Customer;
module.exports.CustomerAddress = CustomerAddress;
module.exports.CustomerMobile = CustomerMobile;
module.exports.validate = validateCustomer;
