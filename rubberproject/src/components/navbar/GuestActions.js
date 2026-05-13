import React from "react";

import { Link } from "react-router-dom";

import { FaUserPlus, FaSignInAlt } from "react-icons/fa";

import styles from "../../styles/Navbar/RoleNavbar.module.css";

function GuestActions() {
  return (
    <>
      <Link to="/signup?role=seller" className={styles.sellerBtn}>
        <FaUserPlus />
        Become a Seller
      </Link>

      <Link to="/login" className={styles.loginBtn}>
        <FaSignInAlt />
        Login
      </Link>

      <Link to="/signup" className={styles.signupBtn}>
        <FaUserPlus />
        Sign Up
      </Link>
    </>
  );
}

export default GuestActions;
