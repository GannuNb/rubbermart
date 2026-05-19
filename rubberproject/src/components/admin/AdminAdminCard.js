// src/components/admin/AdminAdminCard.js

import React from "react";
import styles from "../../styles/Admin/AdminUsers.module.css";

function AdminAdminCard({ user }) {
  return (
    <div className={styles.adminUserCard}>
      <div className={styles.adminUserTopSection}>
        <div className={styles.adminUserImageWrapper}>
          {user.profileImage ? (
            <>
              <img
                src={user.profileImage}
                alt={user.fullName}
                className={styles.adminUserImage}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.target.style.display = "none";
                  const placeholder = e.target.parentElement.querySelector(
                    `.${styles.adminUserImagePlaceholder}`
                  );
                  if (placeholder) {
                    placeholder.style.display = "flex";
                  }
                }}
              />
              <div
                className={styles.adminUserImagePlaceholder}
                style={{ display: "none" }}
              >
                {user.fullName?.charAt(0)?.toUpperCase()}
              </div>
            </>
          ) : (
            <div className={styles.adminUserImagePlaceholder}>
              {user.fullName?.charAt(0)?.toUpperCase()}
            </div>
          )}
        </div>

        <div className={styles.adminUserBasicInfo}>
          <h3 className={styles.adminUserName}>{user.fullName || "Admin"}</h3>
          <div className={styles.adminUserBadgeWrapper}>
            {/* Kept inline with global stylesheets definitions */}
            <span className={styles.adminUserRole}>
              Admin
            </span>
            <span className={styles.adminUserVerified}>
              System Operator
            </span>
          </div>
        </div>
      </div>

      <div className={styles.adminUserInfoGrid}>
        <div className={styles.adminUserInfoCard}>
          <span>Email Address</span>
          <p>{user.email || "N/A"}</p>
        </div>

        <div className={styles.adminUserInfoCard}>
          <span>Account Clearance</span>
          <p>Admin</p>
        </div>

        <div className={styles.adminUserInfoCard}>
          <span>Location</span>
          <p>{user.location || "System Root"}</p>
        </div>

        <div className={styles.adminUserInfoCard}>
          <span>Profile Status</span>
          <p style={{ color: "#12b76a" }}>Active</p>
        </div>
      </div>
    </div>
  );
}

export default AdminAdminCard;