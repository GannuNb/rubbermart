import React from "react";

import styles from "../../styles/Navbar/RoleNavbar.module.css";

function NavbarContainer({
  children,
}) {

  return (

    <div
      className={
        styles.topNavbar
      }
    >

      {children}

    </div>
  );
}

export default NavbarContainer;