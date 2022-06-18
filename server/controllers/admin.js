const bcrypt = require("bcrypt");
const _ = require("lodash");
const { Admin, validate } = require("../models/Admin");
const { Customer } = require("../models/Customer");

class AdminController {
  static async getAllAdmins(req, res, next) {
    const allAdmins = await Admin.fetchAll();
    res.send(allAdmins);
  }

  static async getAdmin(req, res, next) {
    const admin = await Admin.findById();
    res.send(admin);
  }

  static async postAdmin(req, res, next) {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let admin = await Admin.findByEmail(req.body.email);
    const customer = await Customer.findByEmail(req.body.email);
    if (admin || customer)
      return res.status(400).send("Email already registered");

    admin = new Admin(
      _.pick(req.body, ["name", "email", "password", "mobiles"])
    );

    // hash password
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(admin.password, salt);

    await admin.save();
    console.log("admin saved");
    const token = admin.generateAuthToken();
    res
      .header("x-auth-token", token)
      .send(_.pick(admin, ["admin_id", "name", "email"]));
  }
}

module.exports.AdminController = AdminController;
