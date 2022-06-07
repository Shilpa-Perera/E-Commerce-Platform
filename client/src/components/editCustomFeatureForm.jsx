import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";

class EditCustomFeaturesForm extends Form {
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
        this.props.updateCustomFeature({ ...this.state.data });

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
        return (
            <div>
                <h4 className="text-warning mt-5">Edit Custom Feature</h4>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput(
                        "custom_feature_name",
                        "New Custom Feature Name"
                    )}
                    {this.renderInput(
                        "custom_feature_val",
                        "New Custom Feature Value"
                    )}
                    {this.renderButton("Update Custom Feature")}
                </form>
                <button
                    className="btn btn-warning mt-2"
                    onClick={this.props.cancel}
                >
                    Cancel
                </button>
            </div>
        );
    }
}

export default EditCustomFeaturesForm;
