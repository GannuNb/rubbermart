// src/components/navbar/BuyerNavbar.js

import React from "react";

import { Link } from "react-router-dom";

import {
  FaHome,
  FaBoxOpen,
  FaClipboardList,
  FaInfoCircle,
  FaPhoneAlt,
} from "react-icons/fa";

import styles from "../../styles/Navbar/BuyerNavbar.module.css";

function BuyerNavbar({ location }) {
  return (
    <div className={styles.navContainer}>
      {/* HOME */}
      <Link
        to="/home"
        className={`${styles.navLink} ${
          location.pathname === "/home"
            ? styles.active
            : ""
        }`}
      >
        <FaHome />

        <span>Home</span>
      </Link>

      {/* PRODUCTS */}
      <Link
        to="/our-products"
        className={`${styles.navLink} ${
          location.pathname ===
          "/our-products"
            ? styles.active
            : ""
        }`}
      >
        <FaBoxOpen />

        <span>Browse Products</span>
      </Link>

      {/* ORDERS */}
      <Link
        to="/buyer-orders"
        className={`${styles.navLink} ${
          location.pathname ===
          "/buyer-orders"
            ? styles.active
            : ""
        }`}
      >
        <FaClipboardList />

        <span>My Orders</span>
      </Link>

      {/* ABOUT */}
      <Link
        to="/about"
        className={`${styles.navLink} ${
          location.pathname === "/about"
            ? styles.active
            : ""
        }`}
      >
        <FaInfoCircle />

        <span>About Us</span>
      </Link>

      {/* CONTACT */}
      <Link
        to="/contact"
        className={`${styles.navLink} ${
          location.pathname === "/contact"
            ? styles.active
            : ""
        }`}
      >
        <FaPhoneAlt />

        <span>Contact Us</span>
      </Link>
    </div>
  );
}

export default BuyerNavbar;