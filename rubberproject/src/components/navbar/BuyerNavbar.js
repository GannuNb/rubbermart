// src/components/navbar/BuyerNavbar.js

import React from "react";

import styles from "../../styles/Navbar/BuyerNavbar.module.css";

import {
  buyerLinks,
} from "../../config/navbarLinks";

import NavLinksRenderer from "./NavLinksRenderer";

function BuyerNavbar({
  location,
}) {

  return (

    <NavLinksRenderer

      links={buyerLinks}

      location={location}

      containerClass={
        styles.navContainer
      }

      linkClass={
        styles.navLink
      }

      activeClass={
        styles.active
      }

    />
  );
}

export default BuyerNavbar;