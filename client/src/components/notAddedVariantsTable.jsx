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
        const { options: variants } = this.props;
        return (
            <div>
                <h3 className="text-muted mb-4">Variants available to add</h3>
                <table className="table table-hover">
                    <TableHeader
                        columns={this.columns}
                        sortColumn={null}
                        onSort={null}
                    />
                    <tbody>
                        {variants.map((variant, index) => (
                            <tr key={index}>
                                <td>
                                    <OptionTable options={variant.options} />
                                </td>
                                <td>
                                    <AddVariantForm
                                        variant={variant}
                                        addVariant={this.props.addVariant}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default NotAddedVariantsTable;
