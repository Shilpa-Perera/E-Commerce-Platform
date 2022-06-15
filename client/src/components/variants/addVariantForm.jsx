import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";

class AddVariantForm extends Form {
    state = {
        data: {
            variant_name: "",
            price: "",
            quantity: "",
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
        const variantData = this.props.variant;

        if (variantData !== null) {
            const variant = { ...variantData };
            const { variant_name, price, quantity } = { ...this.state.data };

            variant.variant_name = variant_name;
            variant.price = price;
            variant.quantity = quantity;

            await this.props.addVariant(variant);
        } else {
            await this.props.addVariant({ ...this.state.data });
        }

        const data = {
            variant_name: "",
            price: "",
            quantity: "",
        };
        this.setState({ data });
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="d-flex justify-content-between flex-column flex-lg-row mb-3">
                    <div>
                        {this.renderFloatingInput(
                            "variant_name",
                            "Variant Name"
                        )}
                    </div>
                    <div>
                        {this.renderFloatingInput("price", "Price", "number")}
                    </div>
                    <div>
                        {this.renderFloatingInput(
                            "quantity",
                            "Quantity",
                            "number"
                        )}
                    </div>
                    <div>
                        {this.renderStyledButton("Add", "hover-focus", () => (
                            <i className="fa fa-plus-circle"></i>
                        ))}
                    </div>
                </div>
            </form>
        );
    }
}

export default AddVariantForm;
