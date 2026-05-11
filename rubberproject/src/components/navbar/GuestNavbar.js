// src/components/navbar/GuestNavbar.js

import React from "react";

import styles from "../../styles/Navbar/GuestNavbar.module.css";

import {
  guestLinks,
} from "../../config/navbarLinks";

import NavLinksRenderer from "./NavLinksRenderer";

function GuestNavbar({
  location,
}) {

  return (

    <NavLinksRenderer

      links={guestLinks}

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

export default GuestNavbar;