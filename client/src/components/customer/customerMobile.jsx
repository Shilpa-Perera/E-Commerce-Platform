import React from "react";
import Input from "../common/input";

const CustomerMobile = ({
    index,
    mobile,
    mobileError,
    handleChange,
    handleDeleteMobile,
}) => {
    return (
        <div className="row" key={index}>
            <div className="col">
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
                    error={mobileError.mobile}
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
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
};

export default CustomerMobile;
