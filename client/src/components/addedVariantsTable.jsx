import React, { Component } from "react";
import Table from "./common/table";

class AddedVariantsTable extends Component {
    columns = [
        {
            path: "variant_name",
            label: "Name",
        },
        { path: "price", label: "Price" },
        { path: "quantity", label: "Quantity" },
        {
            key: "Options",
            content: ({ options }) => (
                <table className="table table-hover table-sm table-borderless">
                    <tbody>
                        {options.map((option, index) => (
                            <tr key={index}>
                                <th scope="row">{option.option_name}</th>
                                <td>{option.value_name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ),
            label: "Options",
        },
        {
            key: "Default",
            content: (variant) => {
                if (variant.isDefault) return <i className="fa fa-check"></i>;
                return <i className="fa fa-close"></i>;
            },
            label: "Default",
        },
        {
            key: "Actions",
            content: (variant) => (
                <div className="btn-group btn-group-sm">
                    <button
                        className="btn btn-warning btn-sm hover-focus"
                        onClick={() => this.props.onEdit(variant)}
                    >
                        <span className="me-2">Edit</span>
                        <i className="fa fa-edit"></i>
                    </button>
                    {!variant.isDefault && (
                        <button
                            className="btn btn-success btn-sm hover-focus"
                            onClick={() => this.props.onMakeDefault(variant)}
                        >
                            Make Default
                        </button>
                    )}
                </div>
            ),
            label: "Actions",
        },
    ];

    render() {
        const { options, onSort, sortColumn } = this.props;

        return (
            <React.Fragment>
                <h3 className="text-muted mb-4">Added Variants</h3>
                <Table
                    columns={this.columns}
                    data={options}
                    sortColumn={sortColumn}
                    onSort={onSort}
                />
            </React.Fragment>
        );
    }
}

export default AddedVariantsTable;
