// src/components/navbar/GuestNavbar.js

import React from "react";

import { Link } from "react-router-dom";

import {
  FaHome,
  FaInfoCircle,
  FaBoxOpen,
  FaPhoneAlt,
  FaBriefcase,
  FaBookOpen,
} from "react-icons/fa";

import styles from "../../styles/Navbar/GuestNavbar.module.css";

function GuestNavbar({ location }) {
  return (
    <div className={styles.navContainer}>
      {/* HOME */}
      <Link
        to="/"
        className={`${styles.navLink} ${
          location.pathname === "/"
            ? styles.active
            : ""
        }`}
      >
        <FaHome />

        <span>Home</span>
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

      {/* INDUSTRIES */}
      <Link
        to="/industries"
        className={styles.navLink}
      >
        <FaBriefcase />

        <span>Industries We Serve</span>
      </Link>

      {/* BUYER GUIDE */}
      <Link
        to="/buyer-guide"
        className={styles.navLink}
      >
        <FaBookOpen />

        <span>Buyer Guide</span>
      </Link>

      {/* SELLER GUIDE */}
      <Link
        to="/seller-guide"
        className={styles.navLink}
      >
        <FaBookOpen />

        <span>Seller Guide</span>
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

export default GuestNavbar;