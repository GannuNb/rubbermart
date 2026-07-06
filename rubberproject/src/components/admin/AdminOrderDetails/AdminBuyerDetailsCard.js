import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBuilding,
} from "react-icons/fa";

import styles from "../../../styles/Admin/AdminBuyerDetailsCard.module.css";

const AdminBuyerDetailsCard = ({ order }) => {
  const [isOpen, setIsOpen] = useState(false); // Controls accordion visibility
  
  const buyer = order?.buyer || {};
  const businessProfile = buyer?.businessProfile || {};
  const firstAddress = buyer?.addresses?.[0] || {};

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
      {/* Clickable Header Toggle */}
      <div 
        className={styles.dropdownHeader} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className={styles.cardTitle}>Buyer Details</h3>
        <span className={`${styles.toggleIcon} ${isOpen ? styles.iconActive : ""}`}>
          {isOpen ? "−" : "+"}
        </span>
      </div>

      {/* Conditional Content Panel */}
      {isOpen && (
        <div className={styles.dropdownContent}>
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
                {businessProfile?.phoneNumber || "-"}
              </p>
            </div>

            {/* Company */}
            <div className={styles.infoItem}>
              <div className={styles.infoTop}>
                <FaBuilding />
                <span>Company Name</span>
              </div>
              <p className={styles.infoValue}>
                {businessProfile?.companyName || "-"}
              </p>
            </div>

            {/* Full Width Address */}
            <div className={`${styles.infoItem} ${styles.fullWidth}`}>
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
      )}
    </div>
  );
};

export default AdminBuyerDetailsCard;