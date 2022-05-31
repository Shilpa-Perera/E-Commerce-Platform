import React from "react";
import { NavLink } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="py-3 mt-5 mb-4 border-top">
            <div className="container d-flex flex-wrap justify-content-between align-items-center">
                <p className="col-md-4 mb-0 text-muted">© {process.env.REACT_APP_SITE_NAME}</p>

                <ul className="nav col-md-4 justify-content-end">
                    <li className="nav-item">
                        <NavLink
                            className="nav-link px-2 text-muted hover-focus"
                            to={"/products"}
                        >
                            Products
                        </NavLink>
                    </li>
                </ul>
            </div>
        </footer>
    );
}
