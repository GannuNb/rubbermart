// src/components/navbar/UserProfileCard.js
import React from "react";
import { FaUserCircle } from "react-icons/fa";
import styles from "../../styles/Navbar/UserProfileCard.module.css";

function UserProfileCard({ user }) {
  // Safety check to ensure name exists before splitting
  const firstName = user?.name ? user.name.split(" ")[0] : "User";

  return (
    <div className={styles.profileWrapper}>
      <button className={styles.profileBtn}>
        <div className={styles.userAvatar}>
          <FaUserCircle size={32} />
        </div>

        <div className={styles.userInfo}>
          <h4 className={styles.userName}>
            Hi, {firstName}
          </h4>
          <span className={styles.userRole}>
            {user?.role || "Member"}
          </span>
        </div>
      </button>
    </div>
  );
}

export default UserProfileCard;