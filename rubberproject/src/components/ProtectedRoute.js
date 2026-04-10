// src/components/ProtectedRoute.js

import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole, allowedRoles }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Single role support
  if (allowedRole && user.role !== allowedRole) {
    if (user.role === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    }

    if (user.role === "seller") {
      return <Navigate to="/seller-dashboard" replace />;
    }

    return <Navigate to="/" replace />;
  }

  // Multiple roles support
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    }

    if (user.role === "seller") {
      return <Navigate to="/seller-dashboard" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;