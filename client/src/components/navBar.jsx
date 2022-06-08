import React from "react";
import { NavLink } from "react-router-dom";

export default function NavBar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark mb-5">
            <div className="container-fluid">
                <NavLink to="/" className="navbar-brand hover-focus">
                    <img
                        src={`${process.env.PUBLIC_URL}/logo192.png`}
                        alt=""
                        height="24"
                        className="d-inline-block align-text-top"
                    />
                    <span className="ms-2">
                        {process.env.REACT_APP_SITE_NAME}
                    </span>
                </NavLink>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#nav-body"
                    aria-controls="nav-body"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="nav-body">
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
                        <li className="nav-item">
                            <NavLink
                                className="nav-link hover-focus"
                                to="/orders/"
                            >
                                Orders
                            </NavLink>
                        </li>
                    </ul>
                </div>
                <div
                    className="collapse navbar-collapse "
                    id="navbarSupportedContent"
                >
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link hover-focus" to="/">
                                <span className="ms-2">
                                    <i className="fa fa-shopping-cart fa-2x "></i>
                                    <span className="badge rounded-pill badge-notification bg-primary">
                                        1
                                    </span>
                                </span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
