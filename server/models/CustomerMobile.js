const jwt = require("jsonwebtoken");
const Joi = require("joi");
const db = require("../util/database");
const dotenv = require("dotenv");
dotenv.config();

class CustomerAddress {
  constructor(customerMobileDetails) {
    this.telephone_id = customerMobileDetails.telephone_id;
    this.customer_id = customerMobileDetails.customer_id;
    this.mobile = customerMobileDetails.mobile;
  }

  static fetchAll() {
    return db.execute("select * from customer_mobile");
  }

  static findById(id) {
    const sql = `select * from customer_mobile where telephone_id=?;`;
    const [customer_mobiles, _] = await db.execute(sql, [id]);

    if (customer_mobiles.length > 0) {
        return customer_mobiles[0];
      }
      return false;
    }

  async save() {
    await db.execute(
        'insert into customer_mobile (telephone_id, customer_id, mobile) values (?,?,?)',
        [this.telephone_id, this.customer_id, this.mobile],
        (err, results) => {
            if (err) throw err;
            else console.log(results);
        }
    )
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
