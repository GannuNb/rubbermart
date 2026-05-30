import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    // Redirect logged-in users based on their role
    if (user.role === "admin") return <Navigate to="/admin-dashboard" replace />;
    if (user.role === "seller") return <Navigate to="/seller-dashboard" replace />;
    
    // Add logic for Buyer
    if (user.role === "buyer") {
      return !user.businessProfileCompleted 
        ? <Navigate to="/business-profile" replace /> 
        : <Navigate to="/" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children; // If no user, show the login/signup page
};

export default PublicRoute;