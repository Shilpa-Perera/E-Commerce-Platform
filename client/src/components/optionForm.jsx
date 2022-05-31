import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";

class OptionsForm extends Form {
    state = {
        data: {
            option_name: "",
            values: [],
        },
        value_name: "",
        errors: [],
    };

    schema = {
        option_name: Joi.string()
            .required()
            .min(5)
            .max(50)
            .label("Option Name"),
        values: Joi.array().items(Joi.object({ value_name: Joi.string() })),
    };

    valueSchema = {
        value_name: Joi.string().min(1).max(50).required().label("Value Name"),
    };

    handleAddValue = () => {
        const errors = { ...this.state.errors };
        let value_name = this.state.value_name;
        let { error } = Joi.object(this.valueSchema).validate({ value_name });
        error = error ? error.details[0].message : null;

        const data = { ...this.state.data };

        if (error) errors["value_name"] = error;
        else {
            delete errors["value_name"];
            data.values.push({ value_name });
            value_name = "";
            document.getElementById("value_name").value = "";
        }

        this.setState({ value_name, data, errors });
    };

    handleValueChange = ({ currentTarget: input }) => {
        const errors = { ...this.state.errors };
        const value_name = input.value;
        let { error } = Joi.object(this.valueSchema).validate({ value_name });
        error = error ? error.details[0].message : null;
        if (error) errors["value_name"] = error;
        else delete errors["value_name"];

        this.setState({ value_name, errors });
    };

    handleDiscard = () => {
        const data = { ...this.state.data };
        data.values = [];
        const value_name = "";
        this.setState({ data, value_name });
    };

    doSubmit = async () => {
        if (this.state.data.values.length > 0) {
            this.props.addOption(this.state.data);

            document.getElementById("option_name").value = "";
            document.getElementById("values").value = "";
            document.getElementById("value_name").value = "";

            const state = {
                data: {
                    option_name: "",
                    values: [],
                },
                value_name: "",
                errors: [],
            };
            this.setState(state);
        } else {
            const errors = { ...this.state.errors };
            errors["value_name"] = "Add at least one value.";

            this.setState({ errors });
        }
    };

    render() {
        const valueError = this.state.errors["value_name"];
        return (
            <div>
                <h4>Add Option</h4>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput("option_name", "Option Name")}
                    <label htmlFor="values" className="form-label">
                        Current Values
                    </label>
                    <div className="input-group mb-2">
                        <input
                            type="text"
                            className="form-control"
                            disabled={true}
                            aria-describedby="discard-button"
                            value={this.state.data.values
                                .map((value) => value.value_name)
                                .join(", ")}
                            id="values"
                        ></input>
                        <span
                            onClick={this.handleDiscard}
                            className="input-group-text btn btn-danger"
                            id="discard-button"
                        >
                            Discard
                        </span>
                    </div>
                    <label htmlFor="value_name" className="form-label">
                        New Value
                    </label>
                    <div className="input-group mb-2">
                        <input
                            type="text"
                            className="form-control"
                            id="value_name"
                            aria-describedby="value-button"
                            onChange={this.handleValueChange}
                        ></input>
                        <span
                            onClick={this.handleAddValue}
                            className="input-group-text btn btn-warning"
                            id="value-button"
                        >
                            Add Value
                        </span>
                    </div>
                    {valueError && (
                        <div className="alert alert-danger">{valueError}</div>
                    )}
                    {this.renderButton("Add Option")}
                </form>
            </div>
        );
    }
}

export default OptionsForm;
