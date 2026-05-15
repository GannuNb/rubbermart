// src/components/navbar/GuestActions.js
import React from "react";
import { Link } from "react-router-dom";
import { FaUserPlus, FaSignInAlt } from "react-icons/fa";
import styles from "../../styles/Navbar/GuestActions.module.css";

function GuestActions() {
  return (
    <div className={styles.guestWrapper}>
      <Link to="/signup?role=seller" className={styles.sellerBtn}>
        <FaUserPlus />
        <span>Become a Seller</span>
      </Link>

      <Link to="/login" className={styles.loginBtn}>
        <FaSignInAlt />
        <span>Login</span>
      </Link>

      <Link to="/signup" className={styles.signupBtn}>
        <FaUserPlus />
        <span>Sign Up</span>
      </Link>
    </div>
  );
}

export default GuestActions;