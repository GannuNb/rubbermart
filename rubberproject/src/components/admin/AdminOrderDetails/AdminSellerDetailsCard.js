import React from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBuilding,
} from "react-icons/fa";

import styles from "../../../styles/Admin/AdminSellerDetailsCard.module.css";

const AdminSellerDetailsCard = ({ order }) => {
  const seller = order?.seller || {};
  const businessProfile =
    seller?.businessProfile || {};

  const firstAddress =
    seller?.addresses?.[0] || {};

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
      {/* CARD HEADER */}
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>
          Seller Details
        </h3>
      </div>

      <div className={styles.infoGrid}>
        {/* Seller Name */}
        <div className={styles.infoItem}>
          <div className={styles.infoTop}>
            <FaUser />
            <span>Seller Name</span>
          </div>

          <p className={styles.infoValue}>
            {seller?.fullName || "-"}
          </p>
        </div>

        {/* Email */}
        <div className={styles.infoItem}>
          <div className={styles.infoTop}>
            <FaEnvelope />
            <span>Email</span>
          </div>

          <p className={styles.infoValue}>
            {seller?.email || "-"}
          </p>
        </div>

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


      </div>
    </div>
  );
};

export default AdminSellerDetailsCard;