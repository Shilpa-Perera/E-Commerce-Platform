import React from "react";

const FloatingInput = ({ name, label, error, ...rest }) => {
    return (
        <div className="form-group mb-3">
            <div className="form-floating">
                <input
                    {...rest}
                    name={name}
                    id={name}
                    className="form-control"
                    placeholder={label}
                />
                <label htmlFor={name}>{label}</label>
            </div>
            {error && <div className="alert alert-danger mt-2">{error}</div>}
        </div>
    );
};

export default FloatingInput;
