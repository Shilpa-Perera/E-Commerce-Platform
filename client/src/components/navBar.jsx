import React from "react";
import { NavLink } from "react-router-dom";
import { ImSun } from "react-icons/im";
import { BsMoonStarsFill } from "react-icons/bs";
import { MdShoppingCart } from "react-icons/md";

export default function NavBar({ theme, toggleTheme, item_count, user }) {
    const nextTheme = theme ? "light" : "dark";
    const isAdmin = user && user.role === "admin";

    return (
        <nav className="navbar navbar-expand-lg navbar-custom mb-5">
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
                        {isAdmin && (
                            <li className="nav-item dropdown">
                                <span
                                    className="nav-link dropdown-toggle hover-focus"
                                    role="button"
                                    id="navbarDropdown"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Manage
                                </span>
                                <ul
                                    className="dropdown-menu collapsed"
                                    id="product-list-collapse"
                                    aria-labelledby="navbarDropdown"
                                >
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
                                    <li>
                                        <NavLink
                                            className="dropdown-item hover-focus"
                                            to="/products/unavailable/"
                                        >
                                            Unavailable Products
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            className="dropdown-item hover-focus"
                                            to="/categories/link-category"
                                        >
                                            Link Category
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            className="dropdown-item hover-focus"
                                            to="/customers"
                                        >
                                            Manage Customers
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                        )}
                        {isAdmin && (
                            <li className="nav-item">
                                <NavLink
                                    className="nav-link hover-focus"
                                    to="/orders/"
                                >
                                    Orders
                                </NavLink>
                            </li>
                        )}

                        {isAdmin && (
                            <li className="nav-item dropdown">
                                <span
                                    className="nav-link dropdown-toggle hover-focus"
                                    role="button"
                                    id="navbarDropdown"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Reports
                                </span>
                                <ul
                                    className="dropdown-menu collapsed"
                                    id="product-list-collapse"
                                    aria-labelledby="navbarDropdown"
                                >
                                    <li>
                                        <NavLink
                                            className="dropdown-item hover-focus"
                                            to="/reports/quaterly-sales-report"
                                        >
                                            Quaterly Sales Report
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                        )}

                        {user && !isAdmin && (
                            <li className="nav-item">
                                <NavLink
                                    className="nav-link hover-focus"
                                    to={`/customers/${user.user_id}`}
                                >
                                    Profile
                                </NavLink>
                            </li>
                        )}
                    </ul>
                    <ul className="navbar-nav ms-auto">
                        {!user && (
                            <li className="nav-item">
                                <NavLink
                                    className="nav-link hover-focus"
                                    to="/login"
                                >
                                    <p className="font-weight-bold">Login</p>
                                </NavLink>
                            </li>
                        )}
                        {user && (
                            <li className="nav-item">
                                <NavLink
                                    className="nav-link hover-focus"
                                    to="/logout"
                                >
                                    <p className="font-weight-bold">Logout</p>
                                </NavLink>
                            </li>
                        )}
                        {!user && (
                            <li className="nav-item">
                                <NavLink
                                    className="nav-link hover-focus"
                                    to="/customers/register"
                                >
                                    <p className="font-weight-bold">Register</p>
                                </NavLink>
                            </li>
                        )}
                        <li className="nav-item d-flex align-items-center">
                            <span
                                className="ms-2 pointer"
                                onClick={() => toggleTheme(!theme)}
                                data-bs-toggle="tooltip"
                                data-bs-placement="bottom"
                                title={`Switch to ${nextTheme} theme`}
                            >
                                {theme && (
                                    <ImSun className="text-warning h3 d-inline m-0 theme-toggle" />
                                )}
                                {!theme && (
                                    <BsMoonStarsFill className="text-info h3 d-inline m-0 theme-toggle" />
                                )}
                            </span>
                        </li>
                        {!isAdmin && (
                            <li className="nav-item">
                                <NavLink
                                    className="nav-link hover-focus"
                                    to="/cart"
                                >
                                    <span className="ms-2">
                                        <MdShoppingCart
                                            className="mt-1"
                                            size={30}
                                            style={{ fill: "grey" }}
                                        />
                                        <span className="badge rounded-pill badge-notification bg-primary">
                                            {item_count}
                                        </span>
                                    </span>
                                </NavLink>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
