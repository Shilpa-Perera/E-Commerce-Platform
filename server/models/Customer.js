const jwt = require("jsonwebtoken");
const Joi = require("joi");
const db = require("../util/database");
require("dotenv").config();
const config = require("config");

class Customer {
  constructor(customerDetails) {
    this.customer_id = customerDetails.customer_id;
    this.name = customerDetails.name;
    this.email = customerDetails.email;
    this.password = customerDetails.password;
    this.mobiles = customerDetails.mobiles;

    this.addresses = [];
  }

  static fetchAll() {
    return db.execute("select * from customer");
  }

  static async findByEmail(email) {
    let sql = `select * from customer where email=?;`;
    const [customers, _] = await db.execute(sql, [email]);

    if (customers.length > 0) {
      return customers[0];
    }
    return false;
  }

  static async findById(id) {
    const sql = `select * from customer where id=?;`;
    const [customers, _] = await db.execute(sql, [id]);

    if (customers.length > 0) {
      return customers[0];
    }
    return false;
  }

  // inside awaits should call within a transaction
  async save() {
    console.log("start saving");
    await this.saveCustomer();
    await this.saveMobiles();
    await this.saveAddresses();
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

    for (let i = 0; i < this.mobiles.length; i++) {
      const mobile = this.mobiles[i];

      let sql =
        "insert into customer_mobile (customer_id,mobile) values (?,?);";

      await db.execute(sql, [this.customer_id, mobile], (err, results) => {
        if (err) {
          throw err;
        } else {
          console.log(results);
        }
      });
    }
  }

  // before executing "cusomter_id" should be SET
  async saveAddresses() {

    for (let i = 0; i < this.addresses.length; i++) {
      const address = this.addresses[i];

      const sql =
        "insert into customer_address (customer_id,po_box,street_name,city,postal_code) values (?,?,?,?,?);";

      await db.execute(
        sql,
        [
          this.customer_id,
          address.po_box,
          address.street_name,
          address.city,
          address.postal_code,
        ],
        (err, results) => {
          if (err) {
            throw err;
          } else {
            console.log(results);
          }
        }
      );
    }
  }

  updateCustomer(id) {}

  generateAuthToken() {
    const token = jwt.sign(
      { id: this.id, name: this.name, email: this.email },
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
      .required(),
    mobiles: Joi.array()
      .items(Joi.string().pattern(new RegExp("^[+0][0-9]+")))
      .required(),
  });

  return schema.validate(customer);
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;
