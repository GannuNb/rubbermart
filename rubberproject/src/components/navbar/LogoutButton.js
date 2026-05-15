// src/components/navbar/LogoutButton.js
import React from "react";
import { FaSignOutAlt } from "react-icons/fa";
import styles from "../../styles/Navbar/LogoutButton.module.css";

function LogoutButton({ onLogout }) {
  return (
    <button className={styles.topLogoutBtn} onClick={onLogout}>
      <FaSignOutAlt />
      <span>Logout</span>
    </button>
  );
}

export default LogoutButton;