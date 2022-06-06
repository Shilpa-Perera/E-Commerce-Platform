import React, { Component } from "react";
import TableHeader from "./common/tableHeader";
import OptionTable from "./optionTable";
import AddVariantForm from "./addVariantForm";

class NotAddedVariantsTable extends Component {
    columns = [
        {
            path: "options",
            label: "Options",
        },
        {
            path: "actions",
            label: "Actions",
        },
    ];

    render() {
        const { options: variants, defaultUnavailable } = this.props;
        const optionsAvailable = variants.length > 0;
        const optionsUnavailable = variants.length === 0;

        return (
            <div>
                <h3 className="text-warning mb-4">Variants available to add</h3>
                {optionsUnavailable && defaultUnavailable && (
                    <div className="my-5">
                        <span className="alert alert-danger">
                            No options added. Please add a default variant.
                        </span>
                    </div>
                )}
                <table className="table table-hover">
                    <TableHeader
                        columns={this.columns}
                        sortColumn={null}
                        onSort={null}
                    />
                    <tbody>
                        {optionsAvailable &&
                            variants.map((variant, index) => (
                                <tr key={index}>
                                    <td>
                                        <OptionTable
                                            options={variant.options}
                                        />
                                    </td>
                                    <td>
                                        <AddVariantForm
                                            variant={variant}
                                            addVariant={this.props.addVariant}
                                        />
                                    </td>
                                </tr>
                            ))}
                        {optionsUnavailable && defaultUnavailable && (
                            <tr>
                                <td>
                                    <span className="fw-bold">Default</span>
                                </td>
                                <td>
                                    <AddVariantForm
                                        variant={null}
                                        addVariant={
                                            this.props.addDefaultVariant
                                        }
                                    />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default NotAddedVariantsTable;
