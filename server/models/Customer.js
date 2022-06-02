const jwt = require("jsonwebtoken");
const Joi = require("joi");
const db = require("../util/database");
const dotenv = require("dotenv");
dotenv.config();

class Customer {
  constructor(customerDetails) {
    this.customer_id = customerDetails.customer_id;
    this.name = customerDetails.name;
    this.email = customerDetails.email;
    this.password = customerDetails.password;

    this.addresses = [];
    this.mobiles = [];
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

  async save() {
    let sql = "insert into customer (name,email,password) values (?,?,?);";

    await db.execute(
      sql,
      [this.name, this.email, this.password],
      (err, results) => {
        if (err) {
          throw err;
        } else {
          console.log(results);
        }
      }
    );
    this.id = (await Customer.findByEmail(this.email)).id;
  }

  // before executing "cusomter_id" should be SET
  async saveMobiles() {
    // this.mobiles not include "customer_id"
    this.mobiles.forEach(async (mobile) => {
      let sql =
        "insert into customer_mobile (customer_id,mobile) values (?,?);";

      await db.execute(sql, [this.customer_id, mobile], (err, results) => {
        if (err) {
          throw err;
        } else {
          console.log(results);
        }
      });
    });
  }

  // before executing "cusomter_id" should be SET
  async saveAddresses() {
    this.addresses.forEach(async (address) => {
      const sql =
        "insert into customer_address (customer_id,po_box,street_name,city,postal_code) values (?,?,?,?,?,?);";

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
    });
  }

  updateCustomer(id) {}

  generateAuthToken() {
    const token = jwt.sign(
      { id: this.id, name: this.name, email: this.email },
      process.env.jwtPrivateKey
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
