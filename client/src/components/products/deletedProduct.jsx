import React from "react";
import { Link } from "react-router-dom";

function DeletedProduct(props) {
    return (
        <div className="container mb-5">
            <div className="d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <h1 className="display-1 fw-bold text-danger">
                        Deleted Product!
                    </h1>
                    <p className="fs-3 mt-4">
                        Opps! The product you tried to access was deleted from
                        the system.
                    </p>
                    <Link to="/" className="btn btn-primary mt-3">
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default DeletedProduct;
