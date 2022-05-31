const jwt = require("jsonwebtoken");
const Joi = require("joi");
const db = require("../util/database");
const dotenv = require("dotenv");
dotenv.config();

class CustomerAddress {
  constructor(customerAddressDetails) {
    this.address_id = customerAddressDetails.address_id;
    this.customer_id = customerAddressDetails.customer_id;
    this.po_box = customerAddressDetails.po_box;
    this.street_name = customerAddressDetails.street_name;
    this.city = customerAddressDetails.city;
    this.postal_code = customerAddressDetails.postal_code;
  }

  static fetchAll() {
    return db.execute("select * from customer_address");
  }

  static findById(id) {
    const sql = `select * from customer_address where address_id=?;`;
    const [customer_addresses, _] = await db.execute(sql, [id]);

    if (customer_addresses.length > 0) {
        return customer_addresses[0];
      }
      return false;
    }

  async save() {
    let sql = "insert into customer_address (address_id,customer_id,po_box,street_name,city,postal_code) values (?,?,?,?,?,?);";

    await db.execute(
      sql,
      [this.address_id, this.customer_id, this.po_box, this.street_name, this.city, this.postal_code],
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

module.exports.CustomerAddress = CustomerAddress;
module.exports.validate = validateCustomerAddress;
