// src/pages/seller/SellerProfile.js

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfileThunk } from "../../redux/slices/profileThunk";
import styles from "../../styles/SellerProfile.module.css";

function SellerProfile() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProfileThunk());
  }, [dispatch]);

  const businessProfile = user?.businessProfile || {};

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileContainer}>
        <div className={styles.headerSection}>
          <div className={styles.profileImageWrapper}>
            {user?.profileImage ? (
              <>
                <img
                  src={user.profileImage}
                  alt={user.fullName}
                  className={styles.profileImage}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    e.target.style.display = "none";

                    const initials =
                      e.target.parentElement.querySelector(
                        `.${styles.profileInitials}`
                      );

                    if (initials) {
                      initials.style.display = "flex";
                    }
                  }}
                />

                <div
                  className={styles.profileInitials}
                  style={{ display: "none" }}
                >
                  {user?.fullName?.charAt(0)?.toUpperCase()}
                </div>
              </>
            ) : (
              <div className={styles.profileInitials}>
                {user?.fullName?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </div>

          <div className={styles.headerContent}>
            <h1>{user?.fullName || "-"}</h1>
            <p>{user?.email || "-"}</p>

            <div className={styles.badges}>
              <span className={styles.roleBadge}>
                {user?.role || "User"}
              </span>

              {user?.isVerified && (
                <span className={styles.verifiedBadge}>Verified</span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Account Information</h2>

          <div className={styles.grid}>
            <div className={styles.card}>
              <label>Full Name</label>
              <p>{user?.fullName || "-"}</p>
            </div>

            <div className={styles.card}>
              <label>Email</label>
              <p>{user?.email || "-"}</p>
            </div>

            <div className={styles.card}>
              <label>Location</label>
              <p>{user?.location || "Not Added"}</p>
            </div>

            <div className={styles.card}>
              <label>Auth Provider</label>
              <p>{user?.authProvider || "manual"}</p>
            </div>

            <div className={styles.card}>
              <label>Business Profile Completed</label>
              <p>
                {user?.businessProfileCompleted ? "Completed" : "Pending"}
              </p>
            </div>

            <div className={styles.card}>
              <label>Account Created</label>
              <p>
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "-"}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Business Information</h2>

          <div className={styles.grid}>
            <div className={styles.card}>
              <label>Company ID</label>
              <p>{businessProfile.companyId || "-"}</p>
            </div>

            <div className={styles.card}>
              <label>Company Name</label>
              <p>{businessProfile.companyName || "-"}</p>
            </div>

            <div className={styles.card}>
              <label>Phone Number</label>
              <p>{businessProfile.phoneNumber || "-"}</p>
            </div>

            <div className={styles.card}>
              <label>Business Email</label>
              <p>{businessProfile.email || "-"}</p>
            </div>

            <div className={styles.card}>
              <label>GST Number</label>
              <p>{businessProfile.gstNumber || "-"}</p>
            </div>

            <div className={styles.card}>
              <label>PAN Number</label>
              <p>{businessProfile.panNumber || "-"}</p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Address Details</h2>

          <div className={styles.grid}>
            <div className={styles.card}>
              <label>Billing Address</label>
              <p>{businessProfile.billingAddress || "-"}</p>
            </div>

            <div className={styles.card}>
              <label>Shipping Address</label>
              <p>{businessProfile.shippingAddress || "-"}</p>
            </div>

            <div className={styles.card}>
              <label>Same As Billing Address</label>
              <p>
                {businessProfile.sameAsBillingAddress ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>

        {user?.role === "buyer" && (
          <div className={styles.section}>
            <h2>Interested Products</h2>

            <div className={styles.productsWrapper}>
              {businessProfile.interestedProducts?.length > 0 ? (
                businessProfile.interestedProducts.map((product, index) => (
                  <span key={index} className={styles.productTag}>
                    {product}
                  </span>
                ))
              ) : (
                <p className={styles.emptyText}>
                  No interested products added
                </p>
              )}
            </div>
          </div>
        )}

        {(businessProfile.gstCertificate?.file ||
          businessProfile.panCertificate?.file) && (
          <div className={styles.section}>
            <h2>Uploaded Documents</h2>

            <div className={styles.grid}>
              {businessProfile.gstCertificate?.file && (
                <div className={styles.card}>
                  <label>GST Certificate</label>
                  <a
                    href={businessProfile.gstCertificate.file}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View GST Certificate
                  </a>
                </div>
              )}

              {businessProfile.panCertificate?.file && (
                <div className={styles.card}>
                  <label>PAN Certificate</label>
                  <a
                    href={businessProfile.panCertificate.file}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View PAN Certificate
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SellerProfile;