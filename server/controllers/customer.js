const bcrypt = require("bcrypt");
const _ = require("lodash");
const { Customer, CustomerAddress, validate } = require("../models/Customer");

class CustomerController {
  static async getAllCustomers(req, res, next) {
    const allCustomers = await Customer.fetchAll();
    res.send(allCustomers);
  }

  static async getCustomer(req, res, next) {
    const customer = await Customer.findById(req.params.id);
    res.send(customer);
  }

  static async getCustomerAddresses(req, res, next) {
    const user = req.user;
    console.log("getCustomerAddresses", user);
    const customerAddresses = await Customer.fetchAddresses(user.customer_id);
    res.send(customerAddresses);
  }

  static async getCustomerMobiles(req, res, next) {
    const user = req.user;
    const customerMobiles = await Customer.fetchMobiles(user.customer_id);
    res.send(customerMobiles);
  }

  static async postCustomer(req, res, next) {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = await Customer.findByEmail(req.body.email);
    if (customer)
      return res.status(400).send("Customer email already registered");
    console.log("no customer");
    customer = new Customer(_.pick(req.body, ["name", "email", "password", "mobiles"]));

    // hash password
    const salt = await bcrypt.genSalt(10);
    customer.password = await bcrypt.hash(customer.password, salt);

    // create address objects - without "customer_id"
    const addresses = req.body.addresses;
    addresses.forEach((address) => {
      const addressObj = new CustomerAddress(address);
      customer.addresses.push(addressObj);
    });

    await customer.save();
    console.log("customer saved");
    const token = customer.generateAuthToken();
    res
      .header("x-auth-token", token)
      .send(_.pick(customer, ["customer_id", "name", "email"]));
  }
}

module.exports.CustomerController = CustomerController;
