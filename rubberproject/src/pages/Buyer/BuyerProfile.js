// src/pages/buyer/BuyerProfile.js

import React, { useEffect } from "react";

import {
  FaUserCircle,
  FaEnvelope,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaBuilding,
  FaPhoneAlt,
  FaIdCard,
  FaCalendarAlt,
  FaFileAlt,
  FaHome,
  FaCheckCircle,
  FaEdit,
} from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";

import { fetchProfileThunk } from "../../redux/slices/profileThunk";

import styles from "../../styles/Buyer/BuyerProfile.module.css";

function BuyerProfile() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProfileThunk());
  }, [dispatch]);

  const businessProfile = user?.businessProfile || {};

  const addresses = user?.addresses || [];

  const getProfileImage = () => {
    if (!user?.profileImage) return "";

    return user.profileImage;
  };

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileContainer}>
        {/* =========================
            HERO SECTION
        ========================= */}

        <div className={styles.heroSection}>
          <div className={styles.heroOverlay}></div>

          <div className={styles.heroContent}>
            {/* LEFT */}
            <div className={styles.profileLeft}>
              <div className={styles.profileImageWrapper}>
                {getProfileImage() ? (
                  <img
                    src={getProfileImage()}
                    alt={user?.fullName || "Profile"}
                    className={styles.profileImage}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className={styles.profileInitials}>
                    {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
              </div>

              <div className={styles.profileInfo}>
                <h1>{user?.fullName || "Buyer"}</h1>

                <p>{user?.email || "-"}</p>

                <div className={styles.badges}>
                  <span className={styles.roleBadge}>Buyer</span>

                  {user?.isVerified && (
                    <span className={styles.verifiedBadge}>Verified</span>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <button className={styles.editBtn}>
              <FaEdit />
              Edit Profile
            </button>
          </div>
        </div>

        {/* =========================
            ACCOUNT INFORMATION
        ========================= */}

        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <FaUserCircle />
            <h2>Account Information</h2>
          </div>

          <div className={styles.grid}>
            <div className={styles.card}>
              <span>Full Name</span>

              <h4>{user?.fullName || "-"}</h4>

              <FaUserCircle className={styles.cardIcon} />
            </div>

            <div className={styles.card}>
              <span>Email Address</span>

              <h4>{user?.email || "-"}</h4>

              <FaEnvelope className={styles.cardIcon} />
            </div>

            <div className={styles.card}>
              <span>Location</span>

              <h4>{user?.location || "Not Added"}</h4>

              <FaMapMarkerAlt className={styles.cardIcon} />
            </div>

            <div className={styles.card}>
              <span>Auth Provider</span>

              <h4>{user?.authProvider || "manual"}</h4>

              <FaShieldAlt className={styles.cardIcon} />
            </div>

            <div className={styles.card}>
              <span>Account Status</span>

              <h4>{user?.isVerified ? "Active" : "Pending"}</h4>

              <FaCheckCircle className={styles.cardIcon} />
            </div>

            <div className={styles.card}>
              <span>Account Created</span>

              <h4>
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "-"}
              </h4>

              <FaCalendarAlt className={styles.cardIcon} />
            </div>
          </div>
        </div>

        {/* =========================
            BUSINESS INFORMATION
        ========================= */}

        {(businessProfile.companyName ||
          businessProfile.phoneNumber ||
          businessProfile.gstNumber ||
          businessProfile.billingAddress) && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <FaBuilding />
              <h2>Business Information</h2>
            </div>

            <div className={styles.grid}>
              {businessProfile.companyName && (
                <div className={styles.card}>
                  <span>Company Name</span>

                  <h4>{businessProfile.companyName}</h4>

                  <FaBuilding className={styles.cardIcon} />
                </div>
              )}

              {businessProfile.phoneNumber && (
                <div className={styles.card}>
                  <span>Phone Number</span>

                  <h4>{businessProfile.phoneNumber}</h4>

                  <FaPhoneAlt className={styles.cardIcon} />
                </div>
              )}

              {businessProfile.gstNumber && (
                <div className={styles.card}>
                  <span>GST Number</span>

                  <h4>{businessProfile.gstNumber}</h4>

                  <FaIdCard className={styles.cardIcon} />
                </div>
              )}

              {businessProfile.billingAddress && (
                <div className={styles.card}>
                  <span>Billing Address</span>

                  <h4>{businessProfile.billingAddress}</h4>

                  <FaHome className={styles.cardIcon} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================
            INTERESTED PRODUCTS
        ========================= */}

        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <FaFileAlt />
            <h2>Interested Products</h2>
          </div>

          <div className={styles.productsWrapper}>
            {businessProfile.interestedProducts?.length > 0 ? (
              businessProfile.interestedProducts.map((product, index) => (
                <span key={index} className={styles.productTag}>
                  {product}
                </span>
              ))
            ) : (
              <p className={styles.emptyText}>No interested products added</p>
            )}
          </div>
        </div>

        {/* =========================
            SAVED ADDRESSES
        ========================= */}

        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <FaMapMarkerAlt />
            <h2>Saved Addresses</h2>
          </div>

          {addresses.length > 0 ? (
            <div className={styles.addressGrid}>
              {addresses.map((address, index) => (
                <div key={index} className={styles.addressCard}>
                  <div className={styles.addressTop}>
                    <FaHome />

                    <h3>{address.fullName || "Address"}</h3>
                  </div>

                  <p>
                    {address.flatHouse}, {address.areaStreet}
                  </p>

                  <p>{address.landmark}</p>

                  <p>
                    {address.city}, {address.state}
                  </p>

                  <p>{address.pincode}</p>

                  <span>Mobile: {address.mobileNumber}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.emptyText}>No saved addresses found</p>
          )}
        </div>

        {/* =========================
            DOCUMENTS
        ========================= */}

        {(businessProfile.gstCertificate?.file ||
          businessProfile.panCertificate?.file) && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <FaFileAlt />
              <h2>Uploaded Documents</h2>
            </div>

            <div className={styles.grid}>
              {businessProfile.gstCertificate?.file && (
                <div className={styles.documentCard}>
                  <div>
                    <h4>GST Certificate</h4>

                    <p>Uploaded Document</p>
                  </div>

                  <a
                    href={businessProfile.gstCertificate.file}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View
                  </a>
                </div>
              )}

              {businessProfile.panCertificate?.file && (
                <div className={styles.documentCard}>
                  <div>
                    <h4>PAN Certificate</h4>

                    <p>Uploaded Document</p>
                  </div>

                  <a
                    href={businessProfile.panCertificate.file}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View
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

export default BuyerProfile;
