const _ = require("lodash");
const { CustomerAddress, validate } = require("../models/CustomerAddress");

class CustomerAddressController {
  static async getAllCustomerAddresses(req, res, next) {
    const allCustomerAddresses = await CustomerAddress.fetchAll();
    res.send(allCustomerAddresses);
  }

  static async getCustomerAddress(req, res, next) {
    const customerAddress = await CustomerAddress.findById(req.params.id);
    res.send(customerAddress);
  }

  static async postCustomerAddress(req, res, next) {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customerAddress = new CustomerAddress(
      _.pick(req.body, [
        "address_id",
        "customer_id",
        "po_box",
        "street_name",
        "city",
        "postal_code",
      ])
    );

    await customerAddress.save();
  }
}

module.exports.CustomerAddressController = CustomerAddressController;
