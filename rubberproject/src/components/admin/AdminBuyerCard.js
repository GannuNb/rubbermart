// src/components/admin/AdminBuyerCard.js

import React, { useState } from "react";
import styles from "../../styles/AdminUsers.module.css";

function AdminBuyerCard({ user }) {
  const [showMore, setShowMore] = useState(false);

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

                  const placeholder =
                    e.target.parentElement.querySelector(
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
          <h3 className={styles.adminUserName}>{user.fullName}</h3>

          <div className={styles.adminUserBadgeWrapper}>
            <span className={styles.adminUserRole}>Buyer</span>

            {user.isVerified && (
              <span className={styles.adminUserVerified}>Verified</span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.adminUserInfoGrid}>
        <div className={styles.adminUserInfoCard}>
          <span>Email</span>
          <p>{user.email || "N/A"}</p>
        </div>

        <div className={styles.adminUserInfoCard}>
          <span>Location</span>
          <p>{user.location || "N/A"}</p>
        </div>

        <div className={styles.adminUserInfoCard}>
          <span>Phone</span>
          <p>{user.businessProfile?.phoneNumber || "N/A"}</p>
        </div>

        <div className={styles.adminUserInfoCard}>
          <span>Company</span>
          <p>{user.businessProfile?.companyName || "N/A"}</p>
        </div>
      </div>

      <button
        className={styles.adminViewMoreButton}
        onClick={() => setShowMore(!showMore)}
      >
        {showMore ? "Hide Details" : "View More"}
      </button>

      {showMore && (
        <div className={styles.adminExpandedSection}>
          <div className={styles.adminSectionDivider}></div>

          <div className={styles.adminUserInfoGrid}>
            <div className={styles.adminUserInfoCard}>
              <span>Billing Address</span>
              <p>{user.businessProfile?.billingAddress || "N/A"}</p>
            </div>

            <div className={styles.adminUserInfoCard}>
              <span>Shipping Address</span>
              <p>{user.businessProfile?.shippingAddress || "N/A"}</p>
            </div>

            <div className={styles.adminUserInfoCard}>
              <span>GST Number</span>
              <p>{user.businessProfile?.gstNumber || "N/A"}</p>
            </div>

            <div className={styles.adminUserInfoCard}>
              <span>PAN Number</span>
              <p>{user.businessProfile?.panNumber || "N/A"}</p>
            </div>

            <div className={styles.adminUserInfoCard}>
              <span>Interested Products</span>
              <p>
                {user.businessProfile?.interestedProducts?.join(", ") ||
                  "N/A"}
              </p>
            </div>

            <div className={styles.adminUserInfoCard}>
              <span>Profile Status</span>
              <p>
                {user.businessProfileCompleted
                  ? "Completed"
                  : "Pending"}
              </p>
            </div>
          </div>

          {(user.businessProfile?.gstCertificate?.file ||
            user.businessProfile?.panCertificate?.file) && (
            <div className={styles.adminUserDocumentsSection}>
              <h4 className={styles.adminUserDocumentsHeading}>
                Uploaded Documents
              </h4>

              <div className={styles.adminUserDocumentsGrid}>
                {user.businessProfile?.gstCertificate?.file && (
                  <a
                    href={user.businessProfile.gstCertificate.file}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.adminUserDocumentCard}
                  >
                    View GST Certificate
                  </a>
                )}

                {user.businessProfile?.panCertificate?.file && (
                  <a
                    href={user.businessProfile.panCertificate.file}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.adminUserDocumentCard}
                  >
                    View PAN Certificate
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminBuyerCard;