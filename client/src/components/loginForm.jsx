import React, { Component } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Joi from "joi-browser";
import Form from './common/form';
import auth from "../services/authService";

class LoginFormBody extends Form {
  state = {
    data: { username: "", password: "" },
    errors: {},
  };

  schema = {
    username: Joi.string().email().required().label("Username"),
    password: Joi.string().required().label("Password"),
  };

  doSubmit = async () => {
    try {
      const { data } = this.state;
      await auth.loginCustomer(data.username, data.password);

      this.props.navigate("/");
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  };
  
  render() {
    if (auth.getCurrentUser()) return <Navigate to="/" />

    return (
      <div>
        <h1>Login</h1>

        <form onSubmit={this.handleSubmit}>
          {this.renderInput("username", "Username")}
          {this.renderInput("password", "Password", "password")}
          {this.renderButton("Login")}
        </form>
      </div>
    );
  }
}

const LoginForm = (props) => {
  const navigate = useNavigate();
  return <LoginFormBody navigate={navigate} />;
};

export default LoginForm;
