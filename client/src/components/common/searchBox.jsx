import React from "react";

const SearchBox = ({ value, onChange, placeholder }) => {
    if(placeholder == null)placeholder="Search...";
    return (
        <input
            type="text"
            name="query"
            className="form-control my-3"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.currentTarget.value)}
        ></input>
    );
};

export default SearchBox;
