const jwt = require("jsonwebtoken");
const Joi = require("joi");
const db = require("../util/database");
const dotenv = require("dotenv");
dotenv.config();

class Customer {
  constructor(customerDetails) {
    this.name = customerDetails.name;
    this.email = customerDetails.email;
    this.password = customerDetails.password;

    
  }

  static fetchAll() {
    return db.execute("select * from customer");
  }

  static async findByEmail(email) {
    let sql = `select * from customer email=?;`;
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
  });

  return schema.validate(customer);
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;
