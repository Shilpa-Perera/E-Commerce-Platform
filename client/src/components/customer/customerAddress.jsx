import React from "react";
import Input from "../common/input";

const CustomerAddress = ({
    index,
    address,
    addressError,
    handleChange,
    handleDeleteAddress,
}) => {
    return (
        <>
            <div className="col-md-3 ">
                <Input
                    data-array-name="addresses"
                    data-element-id={address.index}
                    key={"po_box" + address.index}
                    id={"po_box" + address.index}
                    type="text"
                    label="Po Box"
                    name="po_box"
                    value={address.po_box}
                    onChange={handleChange}
                    // error={this.state.errors.addresses[address.index].po_box}
                    error={addressError.po_box}
                />
                <Input
                    data-array-name="addresses"
                    data-element-id={address.index}
                    id={"street_name" + address.index}
                    key={"street_name" + address.index}
                    type="text"
                    label="Street Name"
                    name="street_name"
                    value={address.street_name}
                    onChange={handleChange}
                    error={addressError.street_name}
                />
                <Input
                    data-array-name="addresses"
                    data-element-id={address.index}
                    id={"city" + address.index}
                    key={"city" + address.index}
                    type="text"
                    label="City"
                    name="city"
                    value={address.city}
                    onChange={handleChange}
                    error={addressError.city}
                />
                <Input
                    data-array-name="addresses"
                    data-element-id={address.index}
                    id={"postal_code" + address.index}
                    key={"postal_code" + address.index}
                    type="text"
                    label="Postal Code"
                    name="postal_code"
                    value={address.postal_code}
                    onChange={handleChange}
                    error={addressError.postal_code && "Postal Code invalid"}
                />
                <div className="">
                    {index > 0 && (
                        <button
                            key={"address-btn-" + address.index}
                            onClick={(e) => handleDeleteAddress(e, address)}
                            className="btn btn-danger mb-3"
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default CustomerAddress;
