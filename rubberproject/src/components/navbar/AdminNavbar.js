// src/components/navbar/AdminNavbar.js

import React from "react";
import { Link } from "react-router-dom";
import {
  FaSignOutAlt,
  FaTachometerAlt,
  FaBoxOpen,
  FaUsers,
  FaClipboardList,
} from "react-icons/fa";
import styles from "../../styles/Components/RoleNavbar.module.css";

function AdminNavbar({ handleLogout, location }) {
  return (
    <>
      <Link
        to="/admin-dashboard"
        className={`${styles.normalLink} ${
          location.pathname === "/admin-dashboard"
            ? styles.active
            : ""
        }`}
      >
        <FaTachometerAlt />
        <span>Dashboard</span>
      </Link>

      <Link
        to="/admin-approve-products"
        className={`${styles.normalLink} ${
          location.pathname === "/admin-approve-products"
            ? styles.active
            : ""
        }`}
      >
        <FaBoxOpen />
        <span>Approve Products</span>
      </Link>

      <Link
        to="/admin/orders"
        className={`${styles.normalLink} ${
          location.pathname === "/admin/orders"
            ? styles.active
            : ""
        }`}
      >
        <FaClipboardList />
        <span>Orders</span>
      </Link>

      <Link
        to="/admin-products"
        className={`${styles.normalLink} ${
          location.pathname === "/admin-products"
            ? styles.active
            : ""
        }`}
      >
        <FaBoxOpen />
        <span>Products</span>
      </Link>

      <Link
        to="/admin-users"
        className={`${styles.normalLink} ${
          location.pathname === "/admin-users"
            ? styles.active
            : ""
        }`}
      >
        <FaUsers />
        <span>Users</span>
      </Link>

      <button className={styles.logoutBtn} onClick={handleLogout}>
        <FaSignOutAlt />
        <span>Logout</span>
      </button>
    </>
  );
}

export default AdminNavbar;