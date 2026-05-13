// src/components/footer/RoleFooter.js

import React from "react";

import { useSelector } from "react-redux";

import { useLocation } from "react-router-dom";

import BuyerFooter from "./BuyerFooter";

import DashboardFooter from "./DashboardFooter";

function RoleFooter() {

  const location = useLocation();

  const { user } = useSelector(
    (state) => state.auth
  );

  /* =========================
      ROUTES TO HIDE FOOTER
  ========================== */

  const hiddenRoutes = [
    "/login",
    "/signup",
    "/forgot-password",
  ];

  const hideFooter =
    hiddenRoutes.includes(
      location.pathname
    ) ||
    location.pathname.startsWith(
      "/reset-password"
    );

  if (hideFooter) {
    return null;
  }

  /* =========================
      DASHBOARD USERS
  ========================== */

  const isDashboardUser =
    user?.role === "seller" ||
    user?.role === "admin";

  /* =========================
      SHOW FOOTER
  ========================== */

  if (isDashboardUser) {
    return <DashboardFooter />;
  }

  return <BuyerFooter />;
}

export default RoleFooter;