import React from "react";
import styles from "../../styles/Navbar/NavbarDashboard.module.css";
import { transporterLinks } from "../../config/navbarLinks";
import NavLinksRenderer from "./NavLinksRenderer";

function TransporterNavbar({ location }) {
  return (
    <NavLinksRenderer
      links={transporterLinks}
      location={location}
      containerClass={styles.navContainer}
      linkClass={styles.navLink}
      activeClass={styles.active}
    />
  );
}

export default TransporterNavbar;