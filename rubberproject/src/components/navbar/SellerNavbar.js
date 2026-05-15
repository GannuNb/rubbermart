import React from "react";
import styles from "../../styles/Navbar/NavbarDashboard.module.css";
import { sellerLinks } from "../../config/navbarLinks";
import NavLinksRenderer from "./NavLinksRenderer";

function SellerNavbar({ location }) {
  return (
    <NavLinksRenderer
      links={sellerLinks}
      location={location}
      containerClass={styles.navContainer}
      linkClass={styles.navLink}
      activeClass={styles.active}
    />
  );
}

export default SellerNavbar;