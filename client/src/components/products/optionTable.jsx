import React from "react";

export default function OptionTable({ options }) {
    return (
        <table className="table table-hover table-sm table-borderless">
            <tbody>
                {options.map((option, idx) => (
                    <tr key={idx}>
                        <th scope="row">{option.option_name}</th>
                        <td>{option.value_name}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
