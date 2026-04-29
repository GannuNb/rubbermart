// src/components/navbar/BuyerNavbar.js

import React from "react";
import { Link } from "react-router-dom";
import {
  FaSignOutAlt,
  FaHome,
  FaInfoCircle,
  FaShoppingBag,
  FaClipboardList,
} from "react-icons/fa";
import styles from "../../styles/Components/RoleNavbar.module.css";

function BuyerNavbar({ handleLogout, location }) {
  return (
    <>
      <Link
        to="/home"
        className={`${styles.normalLink} ${
          location.pathname === "/home" ? styles.active : ""
        }`}
      >
        <FaHome />
        <span>Home</span>
      </Link>

      <Link
        to="/about"
        className={`${styles.normalLink} ${
          location.pathname === "/about" ? styles.active : ""
        }`}
      >
        <FaInfoCircle />
        <span>About</span>
      </Link>

      <Link
        to="/our-products"
        className={`${styles.normalLink} ${
          location.pathname === "/our-products" ? styles.active : ""
        }`}
      >
        <FaShoppingBag />
        <span>Our Products</span>
      </Link>

      <Link
        to="/buyer-orders"
        className={`${styles.normalLink} ${
          location.pathname === "/buyer-orders" ? styles.active : ""
        }`}
      >
        <FaClipboardList />
        <span>My Orders</span>
      </Link>

      <button className={styles.logoutBtn} onClick={handleLogout}>
        <FaSignOutAlt />
        <span>Logout</span>
      </button>
    </>
  );
}

export default BuyerNavbar;