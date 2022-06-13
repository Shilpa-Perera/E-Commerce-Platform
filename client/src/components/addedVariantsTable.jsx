import React, { Component } from "react";
import Table from "./common/table";
import OptionTable from "./optionTable";

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
            content: ({ options }) => {
                if (options.length > 0)
                    return <OptionTable options={options} />;
                return <span className="fw-bold">Default</span>;
            },
            label: "Options",
        },
        {
            key: "Default",
            content: (variant) => {
                if (variant.isDefault)
                    return (
                        <span className="text-success">
                            <i className="fa fa-check"></i>
                        </span>
                    );
                return (
                    <span className="text-danger">
                        <i className="fa fa-close"></i>
                    </span>
                );
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
                    <button
                        className="btn btn-primary btn-sm hover-focus"
                        onClick={() =>
                            this.props.push(
                                `/products/variants/${variant.variant_id}/images`
                            )
                        }
                    >
                        <span className="me-2">Images</span>
                        <i className="fa fa-image"></i>
                    </button>
                </div>
            ),
            label: "Actions",
        },
    ];

    render() {
        const { options, onSort, sortColumn } = this.props;
        const variantsNotAdded = options.length === 0;

        return (
            <div>
                <h3 className="text-success mb-4">Added Variants</h3>
                {variantsNotAdded && (
                    <div className="my-5">
                        <span className="alert alert-warning">
                            No variants added. The product will not be shown to
                            customer.
                        </span>
                    </div>
                )}
                <Table
                    columns={this.columns}
                    data={options}
                    sortColumn={sortColumn}
                    onSort={onSort}
                />
            </div>
        );
    }
}

export default AddedVariantsTable;
