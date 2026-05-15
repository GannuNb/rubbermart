// src/components/navbar/NavbarContainer.js
import React from "react";
import styles from "../../styles/Navbar/NavbarContainer.module.css";

function NavbarContainer({ children }) {
  return (
    <div className={styles.topNavbar}>
      <div className={styles.navInner}>
        {children}
      </div>
    </div>
  );
}

export default NavbarContainer;