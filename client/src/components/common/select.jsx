import React from "react";

const Select = ({ name, label, error, options, ...rest }) => {
    return (
        <div className="form-group mb-3">
            <label htmlFor={name}>{label}</label>
            <select className="form-control" name={name} id={name} {...rest}>
                {options.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.name}
                    </option>
                ))}
            </select>
            {error && <div className="alert alert-danger mt-1">{error}</div>}
        </div>
    );
};

export default Select;
