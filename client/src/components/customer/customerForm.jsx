import React, { Component } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Joi from "joi-browser";
import Form from "../common/form";
import { getCustomer, saveCustomer } from "../../services/customerService";
import Input from "../common/input";
import { getCurrentUser } from "../../services/authService";

class CustomerFormBody extends Form {
  state = {
    data: {
      customer_id: -1,
      name: "",
      email: "",
      password: "",
      addresses: [
        {
          index: 0,
          address_id: -1,
          po_box: "",
          street_name: "",
          city: "",
          postal_code: "",
        },
      ],
      mobiles: [
        {
          index: 0,
          telephone_id: -1,
          mobile: "",
        },
      ],
    },
    errors: {
      addresses: [{}],
      mobiles: [{}],
    },
  };

  schema = {
    customer_id: Joi.number(),
    name: Joi.string().min(3).max(255).required().label("Name"),
    email: Joi.string().min(3).max(255).required().email().label("Email"),
    password: Joi.string().min(5).max(1024).required().label("Password"),
    addresses: Joi.array()
      .items({
        index: Joi.number(),
        address_id: Joi.number(),
        po_box: Joi.number().label("Po Box"),
        street_name: Joi.string().min(3).label("Street Name"),
        city: Joi.string().label("City"),
        postal_code: Joi.number().label("Postal Code"),
      })
      .required()
      .min(1),
    mobiles: Joi.array()
      .items({
        index: Joi.number(),
        telephone_id: Joi.number(),
        mobile: Joi.string().min(10).max(12).label("Contact No"),
      })
      .required()
      .min(1),
  };

  additionalSchema = {
    index: Joi.number(),

    address_id: Joi.number(),
    po_box: Joi.number().label("Po Box"),
    street_name: Joi.string().label("Street Name"),
    city: Joi.string().label("City"),
    postal_code: Joi.number().label("Postal Code"),

    telephone_id: Joi.number(),
    mobile: Joi.string().min(10).max(12).label("Contact No"),
  };

  // constructor() { 
  //   super();
  //   // const user = getCurrentUser();
  // }

  initiateErrors = () => {
    const errors = {
      addresses: [],
      mobiles: [],
    };
    for (let index = 0; index < this.state.data.addresses.length; index++)
      errors.addresses.push({});
    for (let index = 0; index < this.state.data.mobiles.length; index++)
      errors.mobiles.push({});
    return errors;
  };

  isErrorsEmpty = (errors) => {
    if (!errors) {
      return true;
    }
    if (errors.length > 2) {
      return false;
    } else {
      for (let address of errors.addresses) {
        if (address) return false;
      }
      for (let mobile of errors.mobiles) {
        if (mobile) return false;
      }
    }
    return true;
  };

  async populateCustomer() {
    try {
      const customerId = this.props.params.id;
      // console.log("customerId",  customerId);
      if (customerId === "register") return;

      const errors = {
        addresses: [],
        mobiles: []
      };

      const { data: customer } = await getCustomer(customerId);
      for (let index = 0; index < customer.addresses.length; index++) {
        const address = customer.addresses[index];
        address.index = index;
        delete address.customer_id;

        errors.addresses.push({});
      }
      for (let index = 0; index < customer.mobiles.length; index++) {
        const mobile = customer.mobiles[index];
        mobile.index = index;
        delete mobile.customer_id;  
        
        errors.mobiles.push({});
      }
      // delete customer.customer_id;
      customer.password = "password";

      // console.log("data", customer);
      console.log("set state");
      console.log(customer);
      console.log("new errors", errors);
      this.setState({ data: customer, errors: errors });
    }
    catch (ex) {
      // go to 404 page
    }
  }

  async componentDidMount() {
    // console.log("componentDidMount");
    await this.populateCustomer();
  }

  doSubmit = async () => {
    try {
      console.log("front state", this.state.data);
      const data = { ...this.state.data };
      const mobiles = [];
      const addresses = [];

      for (let address of addresses) {
        delete address.index;
        delete address.address_id;
      };
      for (let i = 0; i < data.addresses.length; i++) {
        const address = { ...data.addresses[i] };
        delete address.index;
        delete address.address_id;
        addresses.push(address);
      }
      for (let mobile of data.mobiles) {
        mobiles.push(mobile.mobile)
      };
      data.mobiles = mobiles;
      data.addresses = addresses;

      await saveCustomer(data);
      console.log("state", this.state);
      this.props.navigate("/");
    } catch (ex) {
      console.log(ex);
    }
  };

  handleAddMoreAddress = (e) => {
    e.preventDefault();
    const { data, errors } = this.state;
    const address = {
      index: data.addresses.length,
      address_id: -1,
      po_box: "",
      street_name: "",
      city: "",
      postal_code: "",
    };

    data.addresses.push(address);
    errors.addresses.push({});
    this.setState({ data, errors });
  };

  handleAddMoreMboile = (e) => {
    e.preventDefault();
    const { data, errors } = this.state;
    const mobile = {
      index: data.mobiles.length,
      telephone_id: -1,
      mobile: "",
    };

    data.mobiles.push(mobile);
    errors.mobiles.push({});
    this.setState({ data, errors });
  };

  handleArrayChange = ({ currentTarget: input }) => {
    const { arrayName, elementId } = input.dataset;
    console.log("handleArrayChange", arrayName, elementId);
    const { data } = this.state;

    const element = { ...data[arrayName][elementId] };
    element[input.name] = input.value;
    data[arrayName][elementId] = element;
    this.setState({ data });
  };

  render() {
    const { addresses, mobiles } = this.state.data;
    console.log("render: ", addresses);
    console.log("render state: ", this.state);
    // console.log("errors", this.state.errors);
    return (
      <div>
        <h1>Register</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("name", "Name")}
          {this.renderInput("email", "Email")}
          {this.renderInput("password", "Password", "password")}
          
          <button onClick={this.handleAddMoreAddress}>
            Add another Address
          </button>
          {addresses.map((address) => (
            <React.Fragment>
              <Input
                data-array-name="addresses"
                data-element-id={address.index}
                key={"po_box"+address.index}
                id={address.index}
                type="text"
                label="Po Box"
                name="po_box"
                value={addresses[address.index].po_box}
                onChange={this.handleChange}
                error={this.state.errors.addresses[address.index].po_box}
              />
              <Input
                data-array-name="addresses"
                data-element-id={address.index}
                id={address.index}
                key={"street_name"+address.index}
                type="text"
                label="Street Name"
                name="street_name"
                value={addresses[address.index].street_name}
                onChange={this.handleChange}
                error={this.state.errors.addresses[address.index].street_name}
              />
              <Input
                data-array-name="addresses"
                data-element-id={address.index}
                id={address.index}
                key={"city"+address.index}
                type="text"
                label="City"
                name="city"
                value={addresses[address.index].city}
                onChange={this.handleChange}
                error={this.state.errors.addresses[address.index].city}
              />
              <Input
                data-array-name="addresses"
                data-element-id={address.index}
                id={address.index}
                key={"postal_code"+address.index}
                type="text"
                label="Postal Code"
                name="postal_code"
                value={addresses[address.index].postal_code}
                onChange={this.handleChange}
                error={this.state.errors.addresses[address.index].postal_code}
              />
            </React.Fragment>
          ))}

          <button onClick={this.handleAddMoreMboile}>Add another Mobile</button>
          {mobiles.map((mobile) => (
            <React.Fragment>
              <Input
                data-array-name="mobiles"
                data-element-id={mobile.index}
                id={mobile.index}
                key={"mobile"+mobile.index}
                type="text"
                label="Contact No"
                name="mobile"
                value={mobile.mobile}
                onChange={this.handleChange}
                error={this.state.errors.mobiles[mobile.index].mobile}
              />
            </React.Fragment>
          ))}

          {this.renderButton("Register")}
        </form>
      </div>
    );
  }
}

const CustomerForm = (props) => {
  const navigate = useNavigate();
  const params = useParams();
  return <CustomerFormBody params={params} navigate={navigate} />;
};

export default CustomerForm;
