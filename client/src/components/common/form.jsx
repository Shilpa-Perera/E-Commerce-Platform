import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./input";
import Select from "./select";

class Form extends Component {
    state = {
        data: {},
        errors: {},
    };

    validate = () => {
        const options = { abortEarly: false };
        const { error } = Joi.object(this.schema).validate(
            this.state.data,
            options
        );
        if (!error) return null;

        const errors = {};
        for (let item of error.details) errors[item.path[0]] = item.message;
        return errors;
    };

    validateProperty = ({ name, value }) => {
        const obj = { [name]: value };
        const { error } = Joi.object({ [name]: this.schema[name] }).validate(
            obj
        );
        return error ? error.details[0].message : null;
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const errors = this.validate();
        this.setState({ errors: errors || {} });
        if (errors) return;
        this.doSubmit();
    };

    handleChange = ({ currentTarget: input }) => {
        const errors = { ...this.state.errors };
        const errorMessage = this.validateProperty(input);
        if (errorMessage) errors[input.name] = errorMessage;
        else delete errors[input.name];

        const data = { ...this.state.data };
        data[input.name] = input.value;
        this.setState({ data, errors });
    };

    renderButton(label) {
        return (
            <button disabled={this.validate()} className="btn btn-primary">
                {label}
            </button>
        );
    }

    renderInput(name, label, type = "text", disabled= false) {
        const { data, errors } = this.state;

        return (
            <Input
                type={type}
                name={name}
                value={data[name]}
                label={label}
                onChange={this.handleChange}
                error={errors[name]}
                disabled={disabled}
            />
        );
    }

    renderSelect(name, label, options, callback = null) {
        const { data, errors } = this.state;
        if (callback === null) callback = this.handleChange;
        return (
            <Select
                name={name}
                value={data[name]}
                label={label}
                options={options}
                onChange={callback}
                error={errors[name]}
            />
        );
    }

    // updateState(state) {
    //     this.setState(state);
    // }
}

export default Form;
