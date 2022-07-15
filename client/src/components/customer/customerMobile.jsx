import React from "react";
import Input from "../common/input";
import { FiTrash } from "react-icons/fi";

const CustomerMobile = ({
    index,
    mobile,
    mobileError,
    handleChange,
    handleDeleteMobile,
}) => {
    return (
        <>
            <div className="col-md-3">
                <Input
                    data-array-name="mobiles"
                    data-element-id={mobile.index}
                    id={"mobile" + mobile.index}
                    key={"mobile" + mobile.index}
                    type="tel"
                    label="Contact No"
                    name="mobile"
                    value={mobile.mobile}
                    onChange={handleChange}
                    error={mobileError.mobile && "Invalid Contact No"}
                />
            </div>
            <div
                className="col"
                style={{
                    marginTop: "25px",
                }}
            >
                {index > 0 && (
                    <button
                        key={"mobile-btn-" + mobile.index}
                        className="btn btn-danger mb-3"
                        onClick={(e) => handleDeleteMobile(e, mobile)}
                    >
                        <FiTrash style={{ fill: "red" }}></FiTrash>
                    </button>
                )}
            </div>
        </>
    );
};

export default CustomerMobile;
