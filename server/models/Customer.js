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
}

class Customer {
  constructor(customerDetails) {
    this.customer_id = customerDetails.customer_id;
    this.name = customerDetails.name;
    this.email = customerDetails.email;
    this.password = customerDetails.password;
    this.mobiles = customerDetails.mobiles;

    this.addresses = [];
  }

  // GET
  static fetchAll() {
    return db.execute("select * from customer");
  }

  static async findByEmail(email) {
    let sql = `select * from customer where email=?;`;
    const [customers, _] = await db.execute(sql, [email]);

    return (customers.length > 0) ? new Customer(customers[0]) : false;
  }

  static async findById(id) {
    const sql = `select * from customer where id=?;`;
    const [customers, _] = await db.execute(sql, [id]);
    return (customers.length > 0) ? customers[0] : false;
  }

  static async fetchAddresses(customerId) {
    const sql = "select * from customer_address where customer_id=?";
    const [customer_addresses, _] = await db.execute(sql, [customerId]);
    return customer_addresses;
  }

  static async fetchMobiles(customerId) {
    const sql = "select * from customer_mobile where customer_id=?";
    const [customer_mobiles, _] = await db.execute(sql, [customerId]);
    return customer_mobiles;
  }

  // POST
  // inside awaits should call within a transaction
  async save() {
    await this.saveCustomer();
    await this.saveMobiles();
    await this.saveAddresses();
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

      const args = [this.customer_id, mobile];

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

  async saveCustomer() {
    let sql = "insert into customer (name,email,password) values (?,?,?);";

    await db.execute(
      sql,
      [this.name, this.email, this.password],
      (err, results) => {
        if (err) {
          throw err;
        } else {
          console.log("results: ", results);
        }
      }
    );
    this.customer_id = (await Customer.findByEmail(this.email)).customer_id;
  }

  // before executing "cusomter_id" should be SET
  async saveMobiles() {
    // this.mobiles not include "customer_id"

    const query = this.getSaveMobilesQueryWithParams().query;
    const params = this.getSaveMobilesQueryWithParams().params;
    console.log(query);
    console.log(params);
    await db.execute(query, params, (err, results) => {
      if (err) {
        throw err;
      } else {
        console.log(results);
      }
    });
  }

  // before executing "cusomter_id" should be SET
  async saveAddresses() {
    const query = this.getSaveAddressesQueryWithParams().query;
    const params = this.getSaveAddressesQueryWithParams().params;

    await db.execute(query, params, (err, results) => {
      if (err) {
        throw err;
      } else {
        console.log(results);
      }
    });
  }

  updateCustomer(id) {}

  generateAuthToken() {
    const token = jwt.sign(
      { customer_id: this.customer_id, name: this.name, email: this.email },
      config.get("jwtPrivateKey")
    );
    return token;
  }
}

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().max(1024).required(),
    addresses: Joi.array()
      .items({
        po_box: Joi.string(),
        street_name: Joi.string(),
        city: Joi.string(),
        postal_code: Joi.string(),
      })
      .required().min(1),
    mobiles: Joi.array()
      .items(Joi.string().pattern(new RegExp("^[+0][0-9]+")))
      .required().min(1),
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
module.exports.validate = validateCustomer;
