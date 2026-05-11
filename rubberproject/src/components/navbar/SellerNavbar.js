import React from "react";

import { Link } from "react-router-dom";

import {
  FaTachometerAlt,
  FaBoxOpen,
  FaClipboardList,
  FaChartLine,
  FaUserTie,
  FaPhoneAlt,
} from "react-icons/fa";

import styles from "../../styles/Navbar/SellerNavbar.module.css";

function SellerNavbar({ location }) {
  return (
    <div className={styles.navContainer}>
      {/* DASHBOARD */}
      <Link
        to="/seller-dashboard"
        className={`${styles.navLink} ${
          location.pathname ===
          "/seller-dashboard"
            ? styles.active
            : ""
        }`}
      >
        <FaTachometerAlt />

        <span>Dashboard</span>
      </Link>

      {/* PRODUCTS */}
      <Link
        to="/seller-products"
        className={`${styles.navLink} ${
          location.pathname ===
          "/seller-products"
            ? styles.active
            : ""
        }`}
      >
        <FaBoxOpen />

        <span>My Products</span>
      </Link>

      {/* ORDERS */}
      <Link
        to="/seller-orders"
        className={`${styles.navLink} ${
          location.pathname ===
          "/seller-orders"
            ? styles.active
            : ""
        }`}
      >
        <FaClipboardList />

        <span>Orders</span>
      </Link>

      {/* ANALYTICS */}
      <Link
        to="/seller-analytics"
        className={`${styles.navLink} ${
          location.pathname ===
          "/seller-analytics"
            ? styles.active
            : ""
        }`}
      >
        <FaChartLine />

        <span>Analytics</span>
      </Link>

      {/* PROFILE */}
      <Link
        to="/seller-profile"
        className={`${styles.navLink} ${
          location.pathname ===
          "/seller-profile"
            ? styles.active
            : ""
        }`}
      >
        <FaUserTie />

        <span>Profile</span>
      </Link>

      {/* CONTACT */}
      <Link
        to="/contact"
        className={`${styles.navLink} ${
          location.pathname ===
          "/contact"
            ? styles.active
            : ""
        }`}
      >
        <FaPhoneAlt />

        <span>Support</span>
      </Link>
    </div>
  );
}

export default SellerNavbar;