import React, { Component } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Joi from "joi-browser";
import Form from "../common/form";
import {
    getCustomer,
    saveCustomer,
    deleteCustomerAddress,
} from "../../services/customerService";
import Input from "../common/input";
import { getCurrentUser } from "../../services/authService";
import ROLE from "../../utils/roles.json";
import Table from "./../common/table";

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
            // console.log("customerId", customerId);
            if (!customerId) return;

            const errors = {
                addresses: [],
                mobiles: [],
            };
            // console.log(" get customer");
            const { data: customer } = await getCustomer(customerId);
            // console.log("customer:", customer);
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
        } catch (ex) {
            toast.error("No customer found.");
        }
    }

    async componentDidMount() {
        // console.log("componentDidMount");
        // check if data is allowed
        const user = getCurrentUser();
        const customerId = this.props.params.id;
        console.log("role:", user);
        console.log("customerId:", typeof customerId);

        if (!customerId) return;
        else if (
            user.role === ROLE.ADMIN ||
            (user.role === ROLE.CUSTOMER &&
                parseInt(customerId) === user.user_id)
        ) {
            await this.populateCustomer();
        } else {
            this.props.navigate("not-found");
        }
    }

    doSubmit = async () => {
        try {
            // console.log("front state", this.state.data);
            const data = { ...this.state.data };

            await saveCustomer(data);
            const user = getCurrentUser();

            user.role === ROLE.ADMIN
                ? this.props.navigate("/customers")
                : this.props.navigate("/");
            // console.log("state", this.state);
            // this.props.navigate("/");
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

    handleDeleteAddress = async (e, address) => {
        e.preventDefault();
        console.log(address);

        const originalData = this.state.data;
        const addresses = originalData.addresses.filter(
            (a) => a.index !== address.index
        );
        const updateData = { ...originalData };
        updateData.addresses = addresses;
        this.setState({ data: updateData });

        if (address.address_id !== -1) {
            try {
                await deleteCustomerAddress(address.address_id);
            } catch (ex) {
                if (ex.response && ex.response.status === 404)
                    toast.error("This book has already deleted.");

                this.setState({ data: originalData });
            }
        }
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
        const {
            addresses,
            mobiles,
            customer_id: customerId,
            name,
        } = this.state.data;
        // console.log("render: ", addresses);
        // console.log("render state: ", this.state);
        // console.log("errors", this.state.errors);
        return (
            <div className="container  mb-5">
                <div className="p-4">
                    <h1>
                        {customerId === -1 ? "Register" : `${name}'s Profile`}
                    </h1>
                </div>
                <div className="row  div-dark">
                    <div className="col mb-3">
                        <form onSubmit={this.handleSubmit}>
                            {this.renderInput("name", "Name")}

                            {customerId === -1
                                ? this.renderInput("email", "Email")
                                : ""}
                            {customerId === -1
                                ? this.renderInput(
                                      "password",
                                      "Password",
                                      "password"
                                  )
                                : ""}
                            <div className="row">
                                <div className="mt-2">
                                    <h3>Addresses</h3>
                                </div>
                                <div className="">
                                    <div className="container   p-5 ">
                                        {addresses.map((address) => (
                                            <div className="row card mb-3 dark">
                                                <div className="col ">
                                                    <Input
                                                        data-array-name="addresses"
                                                        data-element-id={
                                                            address.index
                                                        }
                                                        key={
                                                            "po_box" +
                                                            address.index
                                                        }
                                                        id={
                                                            "po_box" +
                                                            address.index
                                                        }
                                                        type="text"
                                                        label="Po Box"
                                                        name="po_box"
                                                        value={
                                                            addresses[
                                                                address.index
                                                            ].po_box
                                                        }
                                                        onChange={
                                                            this.handleChange
                                                        }
                                                        error={
                                                            this.state.errors
                                                                .addresses[
                                                                address.index
                                                            ].po_box
                                                        }
                                                    />
                                                    <Input
                                                        data-array-name="addresses"
                                                        data-element-id={
                                                            address.index
                                                        }
                                                        id={
                                                            "street_name" +
                                                            address.index
                                                        }
                                                        key={
                                                            "street_name" +
                                                            address.index
                                                        }
                                                        type="text"
                                                        label="Street Name"
                                                        name="street_name"
                                                        value={
                                                            addresses[
                                                                address.index
                                                            ].street_name
                                                        }
                                                        onChange={
                                                            this.handleChange
                                                        }
                                                        error={
                                                            this.state.errors
                                                                .addresses[
                                                                address.index
                                                            ].street_name
                                                        }
                                                    />
                                                    <Input
                                                        data-array-name="addresses"
                                                        data-element-id={
                                                            address.index
                                                        }
                                                        id={
                                                            "city" +
                                                            address.index
                                                        }
                                                        key={
                                                            "city" +
                                                            address.index
                                                        }
                                                        type="text"
                                                        label="City"
                                                        name="city"
                                                        value={
                                                            addresses[
                                                                address.index
                                                            ].city
                                                        }
                                                        onChange={
                                                            this.handleChange
                                                        }
                                                        error={
                                                            this.state.errors
                                                                .addresses[
                                                                address.index
                                                            ].city
                                                        }
                                                    />
                                                    <Input
                                                        data-array-name="addresses"
                                                        data-element-id={
                                                            address.index
                                                        }
                                                        id={
                                                            "postal_code" +
                                                            address.index
                                                        }
                                                        key={
                                                            "postal_code" +
                                                            address.index
                                                        }
                                                        type="text"
                                                        label="Postal Code"
                                                        name="postal_code"
                                                        value={
                                                            addresses[
                                                                address.index
                                                            ].postal_code
                                                        }
                                                        onChange={
                                                            this.handleChange
                                                        }
                                                        error={
                                                            this.state.errors
                                                                .addresses[
                                                                address.index
                                                            ].postal_code
                                                        }
                                                    />
                                                </div>
                                                <div className="col-2">
                                                    <button
                                                        key={
                                                            "address-btn-" +
                                                            address.index
                                                        }
                                                        onClick={(e) =>
                                                            this.handleDeleteAddress(
                                                                e,
                                                                address
                                                            )
                                                        }
                                                        className="btn btn-danger mb-3"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            className="btn btn-warning mb-3"
                                            onClick={this.handleAddMoreAddress}
                                        >
                                            Add another Address
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="mt-3">
                                    <h3>Mobiles</h3>
                                </div>
                                <div className="container mb-5  p-5 div-dark">
                                    {mobiles.map((mobile) => (
                                        <div className="row">
                                            <div className="col">
                                                <Input
                                                    data-array-name="mobiles"
                                                    data-element-id={
                                                        mobile.index
                                                    }
                                                    id={"mobile" + mobile.index}
                                                    key={
                                                        "mobile" + mobile.index
                                                    }
                                                    type="text"
                                                    label="Contact No"
                                                    name="mobile"
                                                    value={mobile.mobile}
                                                    onChange={this.handleChange}
                                                    error={
                                                        this.state.errors
                                                            .mobiles[
                                                            mobile.index
                                                        ].mobile
                                                    }
                                                />
                                            </div>
                                            <div className="col">
                                                <button
                                                    key={
                                                        "mobile-btn-" +
                                                        mobile.index
                                                    }
                                                    className="btn btn-danger mb-3"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        className="btn btn-warning mb-3"
                                        onClick={this.handleAddMoreMboile}
                                    >
                                        Add another Mobile
                                    </button>
                                </div>
                            </div>

                            {customerId === -1
                                ? this.renderButton("Register")
                                : this.renderButton("Update")}
                        </form>
                    </div>
                </div>
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
