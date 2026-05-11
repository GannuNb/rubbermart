import React from "react";

import {
  FaSignOutAlt,
} from "react-icons/fa";

import styles from "../../styles/Navbar/RoleNavbar.module.css";

function LogoutButton({
  onLogout,
}) {

  return (

    <button
      className={
        styles.topLogoutBtn
      }
      onClick={onLogout}
    >

      <FaSignOutAlt />

      Logout

    </button>
  );
}

export default LogoutButton;