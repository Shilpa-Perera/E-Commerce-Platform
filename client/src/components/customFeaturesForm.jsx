import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";

class CustomFeaturesForm extends Form {
    state = {
        data: {
            custom_feature_name: "",
            custom_feature_val: "",
        },
        errors: [],
    };

    schema = {
        custom_feature_name: Joi.string()
            .required()
            .min(5)
            .max(50)
            .label("Custom Feature Name"),
        custom_feature_val: Joi.string()
            .required()
            .min(5)
            .max(50)
            .label("Custom Feature Value"),
    };

    valueSchema = {
        value_name: Joi.string().min(1).max(50).required().label("Value Name"),
    };

    doSubmit = async () => {
        this.props.addCustomFeature({ ...this.state.data });

        document.getElementById("custom_feature_name").value = "";
        document.getElementById("custom_feature_val").value = "";

        const state = {
            data: {
                custom_feature_name: "",
                custom_feature_val: "",
            },
            errors: [],
        };
        this.setState(state);
    };

    render() {
        const valueError = this.state.errors["value_name"];
        return (
            <div>
                <h4>Add Custom Feature</h4>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput(
                        "custom_feature_name",
                        "Custom Feature Name"
                    )}
                    {this.renderInput(
                        "custom_feature_val",
                        "Custom Feature Value"
                    )}
                    {this.renderButton("Add Custom Feature")}
                </form>
            </div>
        );
    }
}

export default CustomFeaturesForm;