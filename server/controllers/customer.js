const bcrypt = require("bcrypt");
const _ = require("lodash");
const { Admin } = require("../models/Admin");
const {
  Customer,
  CustomerAddress,
  CustomerMobile,
  validate,
} = require("../models/Customer");

class CustomerController {
  static async getAllCustomers(req, res, next) {
    const allCustomers = await Customer.fetchAll();
    res.send(allCustomers);
  }

  static async getCustomer(req, res, next) {
    // const user = req.user;
    // if(user.id !== req.params.id) return res.status(403).send("Access Denied");

    const customer = await Customer.fetchAllInfoById(req.params.id);
    res.send(customer);

    // if (!req.query.type || req.query.type === '1') {
    //   // only basic details
    //   const customer = await Customer.findById(req.params.id);
    //   res.send(customer);
    // }
    // else if (req.query.type === '2') {
    //   // all details

    // }
  }

  static async getCustomerAddresses(req, res, next) {
    const user = req.user;
    console.log("getCustomerAddresses", user);
    const customerAddresses = await Customer.fetchAddresses(user.customer_id);
    res.send(customerAddresses);
  }

  static async getCustomerMobiles(req, res, next) {
    const user = req.user;
    console.log("getCustomerMobiles", user);
    const customerMobiles = await Customer.fetchMobiles(user.customer_id);
    res.send(customerMobiles);
  }

  static async postCustomer(req, res, next) {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = await Customer.findByEmail(req.body.email);
    const admin = await Admin.findByEmail(req.body.email);

    if (customer || admin)
      return res.status(400).send("Email already registered");

    customer = new Customer(
      _.pick(req.body, ["name", "email", "password", "mobiles"])
    );

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

  static async updateCustomer(req, res, next) {
    // const { error } = validate(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    // no change of email and password
    const customer = new Customer({
      customer_id: req.params.id,
      name: req.body.name,
      email: req.body.email,
      mobiles: [],
    });

    const addresses = req.body.addresses;
    addresses.forEach(async (address) => {
      const addressObj = new CustomerAddress({
        customer_id: req.params.id,
        ...address,
      });
      // console.log(addressObj);

      // has a error not fixed... if req.body.addresses contain address_id with them.. this will work..
      if (addressObj.address_id !== -1) await addressObj.update();
      else customer.addresses.push(addressObj);
    });

    // create mobile objects - without "customer_id"
    const mobiles = req.body.mobiles;
    mobiles.forEach(async (mobile) => {
      const mobileObj = new CustomerMobile({
        customer_id: req.params.id,
        ...mobile,
      });
      // console.log(mobileObj);

      if (mobileObj.telephone_id !== -1) await mobileObj.update();
      else customer.mobiles.push(mobileObj);
      await mobileObj.update();
    });

    await customer.update();

    // add newly added addresses and mobiles
    console.log("put:", customer.addresses);
    if (customer.addresses.length) await customer.saveAddresses();
    if (customer.mobiles.length) await customer.saveMobiles();

    // console.log("customer updated");
    res.send(_.pick(customer, ["customer_id", "name", "email"]));
  }
}

module.exports.CustomerController = CustomerController;
