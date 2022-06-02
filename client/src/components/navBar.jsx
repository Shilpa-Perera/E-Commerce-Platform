import React from "react";
import { NavLink } from "react-router-dom";

export default function NavBar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-5">
            <div className="container-fluid">
                <NavLink to="/" className="navbar-brand hover-focus">
                    {process.env.REACT_APP_SITE_NAME}
                </NavLink>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink className="nav-link hover-focus" to="/products">
                                Products
                            </NavLink>
                        </li>
                    </ul>
                </div>

                <div className="collapse navbar-collapse " id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link hover-focus" to="/">
                                <span className="ms-2">
                                        <i className="fa fa-shopping-cart fa-2x "></i>
                                        <span class="badge rounded-pill badge-notification bg-primary">1</span>

                                </span>
                                    
                                              
                            </NavLink>
                        </li>
                    </ul>
                </div>

            </div>
        </nav>
    );
}
