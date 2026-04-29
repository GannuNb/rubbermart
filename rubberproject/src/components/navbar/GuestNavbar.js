// src/components/navbar/GuestNavbar.js

import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaUserPlus,
  FaSignInAlt,
  FaHome,
  FaInfoCircle,
} from "react-icons/fa";
import styles from "../../styles/Components/RoleNavbar.module.css";

function GuestNavbar() {
  const location = useLocation();

  return (
    <>
      <Link
        to="/"
        className={`${styles.normalLink} ${
          location.pathname === "/" ? styles.active : ""
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

      <Link to="/signup" className={styles.authBtn}>
        <FaUserPlus />
        <span>Signup</span>
      </Link>

      <Link to="/login" className={styles.authBtn}>
        <FaSignInAlt />
        <span>Login</span>
      </Link>
    </>
  );
}

export default GuestNavbar;