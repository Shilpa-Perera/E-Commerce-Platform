import React from "react";

const ListGroup = ({
    items,
    textProperty,
    valueProperty,
    selectedItem,
    onItemSelect,
    additionalClasses,
    additionalItemClasses,
}) => {
    return (
        <ul className={`list-group ${additionalClasses}`}>
            {items.map((item) => (
                <li
                    onClick={() => onItemSelect(item)}
                    className={
                        item === selectedItem
                            ? `list-group-item hover-focus active clickable ${additionalItemClasses}`
                            : `list-group-item hover-focus hover-color clickable ${additionalItemClasses}`
                    }
                    style={{ cursor: "pointer" }}
                    key={item[valueProperty]}
                >
                    {item[textProperty]}
                </li>
            ))}
        </ul>
    );
};

ListGroup.defaultProps = {
    textProperty: "name",
    valueProperty: "id",
};

export default ListGroup;
