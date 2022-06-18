const jwt = require("jsonwebtoken");
const Joi = require("joi");
const db = require("../util/database");
require("dotenv").config();
const config = require("config");

class Admin {
  constructor(adminDetails) {
    this.admin_id = adminDetails.admin_id;
    this.name = adminDetails.name;
    this.email = adminDetails.email;
    this.password = adminDetails.password;
  }

  static fetchAll() {
    return db.execute("select * from admin");
  }

  
  static async findById(adminId) {
    let sql = `select * from admin where admin_id=?;`;
    const [admins, _] = await db.execute(sql, [adminId]);

    return admins.length > 0 ? new Admin(admins[0]) : false;
  }

  static async findByEmail(email) {
    let sql = `select * from admin where email=?;`;
    const [admins, _] = await db.execute(sql, [email]);

    return admins.length > 0 ? new Admin(admins[0]) : false;
  }

  async save() {
    const sql = "insert into admin (name,email,password) values (?,?,?)";

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

    this.admin_id = (await Admin.findByEmail(this.email)).admin_id;
  }

  generateAuthToken() {
    const token = jwt.sign(
      { customer_id: this.admin_id, name: this.name, email: this.email },
      config.get("jwtPrivateKey")
    );
    return token;
  }
}

function validateAdmin(customer) {
  const schema = Joi.object({
    admin_id: Joi.number(),
    name: Joi.string().min(3).max(255).required(),
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().max(1024).required(),
  });

  return schema.validate(customer);
}

module.exports.Admin = Admin;
module.exports.validate = validateAdmin;
