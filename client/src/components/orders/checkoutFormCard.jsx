import React from "react";
import Form from "../common/form";
import Joi from "joi-browser";
import { setOrderDetails } from "../../services/orderService";
import { toast } from "react-toastify";
import CheckoutPayment from "./checkoutPayment";
import { getCurrentUser } from "../../services/authService";
import { getCustomer } from "../../services/customerService";
import Loading from "../common/loading";

class CheckoutFormCard extends Form {
    state = {
        loading: true,
        data: {
            firstName: "",
            lastName: "",
            email: "",
            deliveryAddress: "",
            city: "",
            zipcode: "",
            telephone: "",
        },
        cartId: null,
        page: null,
        estimatedDelivery: null,
        customerId: null,
        adddressArray: null,
        addressId: null,
        mobileNumberArray: null,
        mobileNumberId: null,
        errors: [],
    };

    schema = {
        firstName: Joi.string().required().min(3).max(250).label("First Name"),
        lastName: Joi.string().required().min(3).max(250).label("Last Name"),
        email: Joi.string().required().email({ minDomainSegments: 2 }),
        deliveryAddress: Joi.string()
            .required()
            .max(1000)
            .label("Delivery Address"),

        city: Joi.string().required().min(1).max(250).label("City"),
        zipcode: Joi.string()
            .regex(/(^\d{5}$)|(^\d{5}-\d{4}$)/)
            .required()
            .min(5)
            .max(5)
            .label("ZIP Code"),
        telephone: Joi.string()
            .regex(/^\+?\d{0,3}\s?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/)
            .required()
            .min(10)
            .max(12)
            .label("Telephone Number"),
    };

    async componentDidMount() {
        let data = {
            firstName: "",
            lastName: "",
            email: "",
            deliveryAddress: "",
            city: "",
            zipcode: "",
            telephone: "",
        };
        const customerId = getCurrentUser();
        if (customerId) {
            try {
                await this.setState({ customerId: customerId.user_id });

                const { data: customer } = await getCustomer(
                    this.state.customerId
                );
                const customerAddress =
                    customer.addresses[0].po_box +
                    ", " +
                    customer.addresses[0].street_name;
                data = {
                    firstName: customer.first_name,
                    lastName: customer.last_name,
                    email: customer.email,
                    deliveryAddress: customerAddress,
                    city: customer.addresses[0].city,
                    zipcode: customer.addresses[0].postal_code,
                    telephone: customer.mobiles[0].mobile,
                };
                this.setState({
                    adddressArray: customer.addresses,
                    addressId: customer.addresses[0].address_id,
                    mobileNumberArray: customer.mobiles,
                    mobileNumberId: customer.mobiles[0].telephone_id,
                });
            } catch (error) {
                return this.setState({ data: data, loading: false });
            }
        }
        this.setState({ data: data, loading: false });
    }

    doSubmit = async () => {
        this.setState({ loading: true });
        let result = null;
        const cartId = this.props.cartId;
        const data = {
            firstName: "",
            lastName: "",
            email: "",
            deliveryAddress: "",
            city: "",
            zipcode: "",
            telephone: "",
        };
        await this.setState({ cartId: cartId });
        this.setState({ data });

        try {
            result = await setOrderDetails(this.state);
        } catch (error) {
            toast.error("Error occured. Try Again!");
        }
        if (result.data[1] === "All set") {
            const page = "payment";
            this.setState({ data: result.data[0] });
            this.setState({ page: page });
            this.setState({ estimatedDelivery: result.data[2] });
        } else {
            toast.warning(result.data[1]);
        }
        this.setState({ loading: false });
    };

    updateAddress(x = 0) {
        const updatedAddress = this.state.adddressArray[x];
        const customerAddress =
            updatedAddress.po_box + ", " + updatedAddress.street_name;

        let data = {
            firstName: this.state.data.firstName,
            lastName: this.state.data.lastName,
            email: this.state.data.email,
            deliveryAddress: customerAddress,
            city: updatedAddress.city,
            zipcode: updatedAddress.postal_code,
            telephone: this.state.data.telephone,
        };
        let errors = this.state.errors;
        delete errors.deliveryAddress;
        this.setState({ data: data, errors: errors });
    }
    updateTelephone(x = 0) {
        const telephoneNumber = this.state.mobileNumberArray[x].mobile;
        let data = {
            firstName: this.state.data.firstName,
            lastName: this.state.data.lastName,
            email: this.state.data.email,
            deliveryAddress: this.state.data.deliveryAddress,
            city: this.state.data.city,
            zipcode: this.state.data.zipcode,
            telephone: telephoneNumber,
        };
        let errors = this.state.errors;
        delete errors.telephone;
        this.setState({ data: data, errors: errors });
    }

    render() {
        let adddressArray = null;
        let mobileNumberArray = null;
        if (this.state.loading) return <Loading />;
        if (this.state.page === null) {
            this.state.customerId !== null
                ? (adddressArray = this.state.adddressArray)
                : (adddressArray = null);
            this.state.customerId !== null
                ? (mobileNumberArray = this.state.mobileNumberArray)
                : (mobileNumberArray = null);

            return (
                <form onSubmit={this.handleSubmit}>
                    <div className="row p-5 div-dark">
                        <div className="col-6 form-group mb-3">
                            {this.renderInput("firstName", "First Name")}
                        </div>
                        <div className="col-6 form-group mb-3">
                            {this.renderInput("lastName", "Last Name")}
                        </div>

                        <div className="col-12 form-group mb-3">
                            {this.renderInput("email", "Email Address")}
                        </div>

                        {!this.state.customerId && (
                            <div className="col-12 form-group mb-3">
                                {this.renderInputWithCustomError(
                                    "telephone",
                                    "Telephone Number",
                                    "Invalid Telephone Number"
                                )}
                            </div>
                        )}

                        {this.state.customerId && (
                            <div className="col-12 row pe-0">
                                <div className="col-11 mb-3 form-group mb-0 pe-0">
                                    <div className="">
                                        {this.renderInputWithCustomError(
                                            "telephone",
                                            "Telephone Number",
                                            "Invalid Telephone Number"
                                        )}
                                    </div>
                                </div>
                                <div className="col-1 mb-2 position-relative ps-0 pe-0">
                                    <div className="position-absolute top-50 start-50 translate-middle w-100 drop-bt">
                                        <button
                                            className="btn btn-outline-secondary dropdown-toggle w-100 hover-focus"
                                            type="text"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                            style={
                                                this.state.errors.hasOwnProperty(
                                                    "telephone"
                                                )
                                                    ? {
                                                          position: "relative",
                                                          top: "-13px",
                                                      }
                                                    : {}
                                            }
                                        ></button>
                                        <ul className="dropdown-menu dropdown-menu-end">
                                            {mobileNumberArray.map((e, i) => {
                                                return (
                                                    <li
                                                        className="dropdown-item"
                                                        onClick={() => {
                                                            return this.updateTelephone(
                                                                i
                                                            );
                                                        }}
                                                    >
                                                        {e.mobile}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!this.state.customerId && (
                            <div className="col-12 mb-3 form-group">
                                {this.renderInputWithCustomError(
                                    "deliveryAddress",
                                    "Street Address",
                                    "Required valid street addresss (Max 1000 chr)"
                                )}
                            </div>
                        )}
                        {this.state.customerId && (
                            <div className="col-12 row pe-0">
                                <div className="col-11 mb-3 form-group mb-0 pe-0">
                                    <div className="">
                                        {this.renderInputWithCustomError(
                                            "deliveryAddress",
                                            "Street Address",
                                            "Required valid street addresss"
                                        )}
                                    </div>
                                </div>
                                {/* drop-div: class to fix overlapping issue */}
                                <div className="col-1 mb-2 position-relative ps-0 pe-0 drop-div">
                                    <div className="position-absolute top-50 start-50 translate-middle w-100">
                                        <button
                                            className="btn btn-outline-secondary dropdown-toggle w-100 hover-focus"
                                            type="text"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                            style={
                                                this.state.errors.hasOwnProperty(
                                                    "deliveryAddress"
                                                )
                                                    ? {
                                                          position: "relative",
                                                          top: "-13px",
                                                      }
                                                    : {}
                                            }
                                        ></button>
                                        <ul className="dropdown-menu dropdown-menu-end">
                                            {adddressArray.map((e, i) => {
                                                return (
                                                    <li
                                                        className="dropdown-item"
                                                        onClick={() => {
                                                            return this.updateAddress(
                                                                i
                                                            );
                                                        }}
                                                    >
                                                        {e.po_box +
                                                            " " +
                                                            e.street_name}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="col-6 form-group mb-3">
                            {this.renderInput("city", "City")}
                        </div>

                        <div className="col-6 form-group mb-3">
                            {this.renderInputWithCustomError(
                                "zipcode",
                                "ZIP Code",
                                "Invalid ZIP Code"
                            )}
                        </div>

                        <div className="col-12 form-group mb-3">
                            {this.renderStyledButton(
                                "Proceed to Payment",
                                "hover-focus"
                            )}
                        </div>
                    </div>
                </form>
            );
        } else if (this.state.page === "payment") {
            return (
                <div>
                    <CheckoutPayment
                        onCheckout={this.props.onCheckout}
                        data={this.state.data}
                        deliveryEstimate={this.state.estimatedDelivery}
                        cartTotal={this.props.cartTotal}
                        customerId={this.state.customerId}
                    />
                </div>
            );
        }
    }
}

export default CheckoutFormCard;
