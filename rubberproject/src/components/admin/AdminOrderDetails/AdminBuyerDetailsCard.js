// src/components/admin/AdminOrderDetails/AdminBuyerDetailsCard.js

import React from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBuilding,
} from "react-icons/fa";

import styles from "../../../styles/Admin/AdminBuyerDetailsCard.module.css";

const AdminBuyerDetailsCard = ({ order }) => {
  const buyer = order?.buyer || {};
  const businessProfile =
    buyer?.businessProfile || {};

  const firstAddress =
    buyer?.addresses?.[0] || {};

  const fullAddress = [
    firstAddress?.flatHouse,
    firstAddress?.areaStreet,
    firstAddress?.landmark,
    firstAddress?.city,
    firstAddress?.state,
    firstAddress?.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className={styles.infoCard}>
      {/* =========================
          CARD HEADER
      ========================= */}
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>
          Buyer Details
        </h3>
      </div>

      {/* =========================
          2 ROWS ONLY
      ========================= */}
      <div className={styles.infoGrid}>
        {/* Row 1 */}

        {/* Buyer Name */}
        <div className={styles.infoItem}>
          <div className={styles.infoTop}>
            <FaUser />
            <span>Buyer Name</span>
          </div>

          <p className={styles.infoValue}>
            {buyer?.fullName || "-"}
          </p>
        </div>

        {/* Email */}
        <div className={styles.infoItem}>
          <div className={styles.infoTop}>
            <FaEnvelope />
            <span>Email</span>
          </div>

          <p className={styles.infoValue}>
            {buyer?.email || "-"}
          </p>
        </div>

        {/* Row 2 */}

        {/* Phone */}
        <div className={styles.infoItem}>
          <div className={styles.infoTop}>
            <FaPhone />
            <span>Phone Number</span>
          </div>

          <p className={styles.infoValue}>
            {businessProfile?.phoneNumber ||
              "-"}
          </p>
        </div>

        {/* Company */}
        <div className={styles.infoItem}>
          <div className={styles.infoTop}>
            <FaBuilding />
            <span>Company Name</span>
          </div>

          <p className={styles.infoValue}>
            {businessProfile?.companyName ||
              "-"}
          </p>
        </div>

        {/* Full Width Address */}

        <div
          className={`${styles.infoItem} ${styles.fullWidth}`}
        >
          <div className={styles.infoTop}>
            <FaMapMarkerAlt />
            <span>Delivery Address</span>
          </div>

          <p className={styles.infoValue}>
            {fullAddress || "-"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminBuyerDetailsCard;