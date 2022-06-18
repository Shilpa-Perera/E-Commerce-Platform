import React from "react";

const Input = ({ name, label, error, id, ...rest }) => {
    return (
        <div className="form-group mb-3">
            <label htmlFor={name}>{label}</label>
            {/* <input {...rest} name={name} id={name} className="form-control" /> */}
            {id !== null && id !== undefined && (
                <input {...rest} name={name} id={id} className="form-control" />
            )}
            {(id === null || id === undefined) && (
                <input
                    {...rest}
                    name={name}
                    id={name}
                    className="form-control"
                />
            )}
            {error && <div className="alert alert-danger mt-2">{error}</div>}
        </div>
    );
};

export default Input;
