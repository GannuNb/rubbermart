// src/components/navbar/AdminNavbar.js

import React from "react";

import { Link } from "react-router-dom";

import {
  FaTachometerAlt,
  FaBoxOpen,
  FaUsers,
  FaClipboardList,
  FaChartBar,
  FaUserShield,
} from "react-icons/fa";

import styles from "../../styles/Navbar/AdminNavbar.module.css";

function AdminNavbar({ location }) {
  return (
    <div className={styles.navContainer}>
      {/* DASHBOARD */}
      <Link
        to="/admin-dashboard"
        className={`${styles.navLink} ${
          location.pathname ===
          "/admin-dashboard"
            ? styles.active
            : ""
        }`}
      >
        <FaTachometerAlt />

        <span>Dashboard</span>
      </Link>

      {/* APPROVE PRODUCTS */}
      <Link
        to="/admin-approve-products"
        className={`${styles.navLink} ${
          location.pathname ===
          "/admin-approve-products"
            ? styles.active
            : ""
        }`}
      >
        <FaBoxOpen />

        <span>Approve Products</span>
      </Link>

      {/* ORDERS */}
      <Link
        to="/admin/orders"
        className={`${styles.navLink} ${
          location.pathname ===
          "/admin/orders"
            ? styles.active
            : ""
        }`}
      >
        <FaClipboardList />

        <span>Orders</span>
      </Link>

      {/* PRODUCTS */}
      <Link
        to="/admin-products"
        className={`${styles.navLink} ${
          location.pathname ===
          "/admin-products"
            ? styles.active
            : ""
        }`}
      >
        <FaBoxOpen />

        <span>Products</span>
      </Link>

      {/* USERS */}
      <Link
        to="/admin-users"
        className={`${styles.navLink} ${
          location.pathname ===
          "/admin-users"
            ? styles.active
            : ""
        }`}
      >
        <FaUsers />

        <span>Users</span>
      </Link>

      {/* ANALYTICS */}
      <Link
        to="/admin-analytics"
        className={`${styles.navLink} ${
          location.pathname ===
          "/admin-analytics"
            ? styles.active
            : ""
        }`}
      >
        <FaChartBar />

        <span>Analytics</span>
      </Link>

      {/* ADMIN PROFILE */}
      <Link
        to="/admin-profile"
        className={`${styles.navLink} ${
          location.pathname ===
          "/admin-profile"
            ? styles.active
            : ""
        }`}
      >
        <FaUserShield />

        <span>Admin Profile</span>
      </Link>
    </div>
  );
}

export default AdminNavbar;