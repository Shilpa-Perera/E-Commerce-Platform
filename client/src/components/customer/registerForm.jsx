import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import Joi from "joi-browser";
import Form from "../common/form";
import { saveCustomer } from "../../services/customerService";
import Input from "../common/input";

class RegisterFormBody extends Form {
  state = {
    data: {
      name: "",
      email: "",
      password: "",
      addresses: [
        {
          index: 0,
          po_box: "",
          street_name: "",
          city: "",
          postal_code: "",
        },
      ],
      mobiles: [
        {
          index: 0,
          contact_no: "",
        },
      ],
    },
    errors: {
      addresses: [{}],
      mobiles: [{}],
    },
  };

  schema = {
    name: Joi.string().min(3).max(255).required().label("Name"),
    email: Joi.string().min(3).max(255).required().email().label("Email"),
    password: Joi.string().min(5).max(1024).required().label("Password"),
    addresses: Joi.array()
      .items({
        index: Joi.number(),
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
        contact_no: Joi.string().min(10).max(12).label("Contact No"),
      })
      .required()
      .min(1),
  };

  additionalSchema = {
    index: Joi.number(),

    po_box: Joi.number().label("Po Box"),
    street_name: Joi.string().label("Street Name"),
    city: Joi.string().label("City"),
    postal_code: Joi.number().label("Postal Code"),

    contact_no: Joi.string().min(10).max(12).label("Contact No"),
  };


  initiateErrors = () => {
    const errors = {
      addresses: [],
      mobiles: [],
    };
    for (let index = 0; index < this.state.errors.addresses.length; index++)
      errors.addresses.push({});
    for (let index = 0; index < this.state.errors.mobiles.length; index++)
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

  // validate = () => {
  //   const { error } = Joi.validate(this.state.data, this.schema, {
  //     abortEarly: false,
  //   });

  //   if (!error) return null;

  //   const errors = this.initiateErrors();

  //   for (let item of error.details) {
  //     if (item.path.length > 1) {
  //       errors[item.path[0]][item.path[1]][item.path[2]] = item.message;
  //     } else {
  //       errors[item.path[0]] = item.message;
  //     }
  //   }
  //   return errors;
  // };

  // validateProperty = ({ name, value }, fromAdditional = false) => {
  //   const obj = { [name]: value };
  //   if (!fromAdditional) {
  //     const { error } = Joi.object({ [name]: this.schema[name] }).validate(obj);
  //     return error ? error.details[0].message : null;
  //   } 
  //   else {
  //     console.log("validateProperty", obj)
  //     const { error } = Joi.object({
  //       [name]: this.additionalSchema[name],
  //     }).validate(obj);
  //     return error ? error.details[0].message : null;
  //   }
  // };

  // handleSubmit = (e) => {
  //   e.preventDefault();
  //   const errors = this.validate();
  //   this.setState({ errors: errors || { ...this.initiateErrors() } });
  //   if (errors) {
  //     console.log("inside handle submit: ", errors);
  //     return;
  //   }
  //   console.log("inside handle submit outside ", errors);
  //   this.doSubmit();
  // };

  doSubmit = async () => {
    try {
      const { data } = this.state;
      const mobiles = [];

      for (let address of data.addresses) delete address.index;
      for (let mobile of data.mobiles) mobiles.push(mobile.contact_no);
      data.mobiles = mobiles;

      await saveCustomer(data);
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
      contact_no: "",
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

  // handleChange = ({ currentTarget: input }) => {
  //   const errors = { ...this.state.errors };
  //   const data = { ...this.state.data };
  //   const { arrayName, elementId } = input.dataset;

  //   if (arrayName) {
  //     const errorMessage = this.validateProperty(
  //       input,
  //       true
  //     );
  //     if (errorMessage) errors[arrayName][elementId][input.name] = errorMessage;
  //     else delete errors[arrayName][elementId][input.name];

  //     const element = { ...data[arrayName][elementId] };
  //     element[input.name] = input.value;
  //     data[arrayName][elementId] = element;
  //     this.setState({ data, errors });
  //   } 
  //   else {
  //     const errorMessage = this.validateProperty(input);
  //     if (errorMessage) errors[input.name] = errorMessage;
  //     else delete errors[input.name];

  //     data[input.name] = input.value;
  //     this.setState({ data, errors });
  //   }
  // };

  render() {
    const { addresses, mobiles } = this.state.data;
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
                key={address.index}
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
                key={address.index}
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
                key={address.index}
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
                key={address.index}
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
                key={mobile.index}
                type="text"
                name="contact_no"
                value={mobile.contact_no}
                onChange={this.handleChange}
                error={this.state.errors.mobiles[mobile.index].contact_no}
              />
            </React.Fragment>
          ))}

          {this.renderButton("Register")}
        </form>
      </div>
    );
  }
}

const RegisterForm = (props) => {
  const navigate = useNavigate();
  return <RegisterFormBody navigate={navigate} />;
};

export default RegisterForm;
