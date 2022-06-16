import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";

class EditVariantForm extends Form {
    state = {
        data: {
            variant_name: "",
            price: 0,
            quantity: 0,
        },
        errors: [],
    };

    schema = {
        variant_name: Joi.string()
            .required()
            .min(3)
            .max(250)
            .label("Variant Name"),
        price: Joi.number().required().min(1).label("Price"),
        quantity: Joi.number().required().min(0).label("Quantity"),
        options: Joi.array(),
    };

    doSubmit = async () => {
        await this.props.updateVariant({ ...this.state.data });

        const state = {
            data: {
                variant_name: "",
                price: 0,
                quantity: 0,
            },
            errors: [],
        };
        this.setState(state);
    };

    render() {
        const { options } = this.props;
        return (
            <div className="mt-5">
                <h4 className="text-warning mb-5">Edit Variant</h4>
                <div>
                    <h5 className="text-danger mb-4">Selected Options</h5>
                    <table className="table table-hover mb-5">
                        <thead>
                            <tr>
                                <th>Option</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {options.map((option, index) => (
                                <tr key={index}>
                                    <th scope="row">{option.option_name}</th>
                                    <td>{option.value_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <h5 className="text-success mb-4">New values</h5>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput("variant_name", "Variant Name")}
                    {this.renderInput("price", "Price", "number")}
                    {this.renderInput("quantity", "Quantity", "number")}
                    {this.renderButton("Update")}
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

export default EditVariantForm;
