import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="py-3 mt-auto mb-4 border-top">
            <div className="container d-flex flex-wrap justify-content-between align-items-center">
                <p className="col-md-4 mb-0 text-muted">
                    © {process.env.REACT_APP_SITE_NAME}
                </p>
                <Link
                    to="/"
                    className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none"
                >
                    <img
                        src={process.env.PUBLIC_URL + "/sitedata/logo192.png"}
                        alt=""
                        width="40"
                        className="d-inline-block align-text-top"
                    />
                </Link>
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
