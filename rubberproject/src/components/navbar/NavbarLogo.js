// src/components/navbar/NavbarLogo.js
import React from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/Navbar/NavbarLogo.module.css";

function NavbarLogo({ logoPath = "/" }) {
  return (
    <div className={styles.logoSection}>
      <Link to={logoPath} className={styles.logoLink}>
        <img
          src="/rsm_logo.png"
          alt="Rubber Scrap Mart"
          className={styles.logoImage}
        />
      </Link>
    </div>
  );
}

export default NavbarLogo;