import React, { Component, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import auth from "../services/authService";

function Logout() {
    console.log("loging out");
    const navigate = useNavigate();
    useEffect(() => {
        auth.logoutUser();
        navigate("/");
    }, [])
}

export default Logout;
