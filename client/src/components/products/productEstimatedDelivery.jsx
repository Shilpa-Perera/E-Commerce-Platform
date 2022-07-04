import React, { useState } from "react";

function ProductEstimatedDelivery({ addresses, inStock }) {
    const [selected, setSelected] = useState(0);
    const { estimated_delivery } = addresses[selected];

    const handleAddressChange = (e) => {
        const selectedAddress = parseInt(e.target.value);
        setSelected(selectedAddress);
    };

    return (
        <div className="div-dark mt-5 mb-3">
            <h5 className="text-muted">Estimated Delivery</h5>
            <table className="table table-borderless">
                <tbody>
                    <tr>
                        <th scope="row">Availability</th>
                        <td>{inStock ? "In Stock" : "Out of Stock"}</td>
                    </tr>
                    <tr>
                        <th scope={"row"}>Address</th>
                        <td>
                            <select
                                name="addresses"
                                id="addresses"
                                className="form-control"
                                onChange={handleAddressChange}
                            >
                                {addresses.map(
                                    (
                                        {
                                            po_box,
                                            street_name,
                                            city,
                                            postal_code,
                                        },
                                        index
                                    ) => (
                                        <option key={index} value={index}>
                                            {`${po_box}, ${street_name}, ${city}, ${postal_code}`}
                                        </option>
                                    )
                                )}
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th scope={"row"}>Estimated Delivery</th>
                        <td>{`${estimated_delivery} days`}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default ProductEstimatedDelivery;
