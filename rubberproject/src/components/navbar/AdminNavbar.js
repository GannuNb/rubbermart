// src/components/navbar/AdminNavbar.js
import React from "react";
import styles from "../../styles/Navbar/AdminNavbar.module.css";
import { adminLinks } from "../../config/navbarLinks";
import NavLinksRenderer from "./NavLinksRenderer";

function AdminNavbar({ location }) {
  return (
    <nav className={styles.adminNavWrapper}>
      <NavLinksRenderer
        links={adminLinks}
        location={location}
        containerClass={styles.navContainer}
        linkClass={styles.navLink}
        activeClass={styles.active}
      />
    </nav>
  );
}

export default AdminNavbar;