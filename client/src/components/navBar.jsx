import React from "react";
import { NavLink } from "react-router-dom";

export default function NavBar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-5">
            <div className="container-fluid">
                <NavLink to="/" className="navbar-brand hover-focus">
                    {process.env.REACT_APP_SITE_NAME}
                </NavLink>
                <div
                    className="collapse navbar-collapse"
                    id="navbarSupportedContent"
                >
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink
                                className="nav-link hover-focus"
                                to="/products/"
                            >
                                Products
                            </NavLink>
                        </li>
                        <li className="nav-item dropdown">
                            <span
                                className="nav-link dropdown-toggle hover-focus"
                                role="button"
                                id="navbarDropdown"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Products
                            </span>
                            <ul
                                className="dropdown-menu collapsed"
                                id="product-list-collapse"
                                aria-labelledby="navbarDropdown"
                            >
                                <li>
                                    <NavLink
                                        className="dropdown-item hover-focus"
                                        to="/products/"
                                    >
                                        Product Album
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        className="dropdown-item hover-focus"
                                        to="/products/edit/new"
                                    >
                                        New Product
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        className="dropdown-item hover-focus"
                                        to="/products/edit/"
                                    >
                                        Manage Products
                                    </NavLink>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
