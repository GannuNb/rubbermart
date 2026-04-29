// src/components/navbar/SellerNavbar.js

import React from "react";
import { Link } from "react-router-dom";
import {
  FaSignOutAlt,
  FaTachometerAlt,
  FaBoxOpen,
  FaClipboardList,
  FaUser,
} from "react-icons/fa";
import styles from "../../styles/Components/RoleNavbar.module.css";

function SellerNavbar({ handleLogout, location }) {
  return (
    <>
      <Link
        to="/seller-dashboard"
        className={`${styles.normalLink} ${
          location.pathname === "/seller-dashboard"
            ? styles.active
            : ""
        }`}
      >
        <FaTachometerAlt />
        <span>Dashboard</span>
      </Link>

      <Link
        to="/seller-add-products"
        className={`${styles.normalLink} ${
          location.pathname === "/seller-add-products"
            ? styles.active
            : ""
        }`}
      >
        <FaBoxOpen />
        <span>Add Products</span>
      </Link>

      <Link
        to="/seller-products"
        className={`${styles.normalLink} ${
          location.pathname === "/seller-products"
            ? styles.active
            : ""
        }`}
      >
        <FaBoxOpen />
        <span>Manage Products</span>
      </Link>

      <Link
        to="/seller/orders"
        className={`${styles.normalLink} ${
          location.pathname === "/seller/orders"
            ? styles.active
            : ""
        }`}
      >
        <FaClipboardList />
        <span>Orders</span>
      </Link>

      <Link
        to="/seller-profile"
        className={`${styles.normalLink} ${
          location.pathname === "/seller-profile"
            ? styles.active
            : ""
        }`}
      >
        <FaUser />
        <span>Profile</span>
      </Link>

      <button className={styles.logoutBtn} onClick={handleLogout}>
        <FaSignOutAlt />
        <span>Logout</span>
      </button>
    </>
  );
}

export default SellerNavbar;