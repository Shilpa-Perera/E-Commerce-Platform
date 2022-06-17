import React, { Component } from "react";
import { Route, Navigate } from "react-router-dom";
import auth from "../../services/authService";

const ProtectedRoute = ({ children }) => {
  if (!auth.getCurrentUser()) {
    return <Navigate to={{
      pathname: "/login",
      // state: { from: children.location }
    }} />;
  }
  return children;
};

export default ProtectedRoute;
