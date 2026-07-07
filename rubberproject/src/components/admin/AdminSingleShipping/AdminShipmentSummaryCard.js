import React, { useState } from "react";
import {
  FaCheckCircle,
  FaClock,
  FaCalendarCheck,
} from "react-icons/fa";

import styles from "../../../styles/Admin/AdminSingleShippingInvoice.module.css";

const AdminShipmentSummaryCard = ({ shipment }) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN");
  };

  const getReadableStatus = (status) => {
    if (!status) return "-";

    return status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div
      className={styles.infoCard}
      style={{ padding: "0", overflow: "hidden" }}
    >
      {/* HEADER */}
      <div
        className={styles.dropdownHeader}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 24px",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <h3
          className={styles.cardTitle}
          style={{ margin: 0 }}
        >
          Shipment Summary
        </h3>

        <div
          className={`${styles.toggleIconBtn} ${
            isOpen ? styles.activeToggle : ""
          }`}
        >
          {isOpen ? "−" : "+"}
        </div>
      </div>

      {/* BODY */}
      {isOpen && (
        <div
          className={styles.infoList}
          style={{ padding: "0 24px 24px" }}
        >
          {/* Status */}
          <div className={styles.infoRow}>
            <FaCheckCircle />

            <div>
              <p className={styles.label}>
                Shipment Status
              </p>

              <h4 className={styles.value}>
                {getReadableStatus(
                  shipment?.shipmentStatus
                )}
              </h4>
            </div>
          </div>

          {/* Approved */}
          <div className={styles.infoRow}>
            <FaClock />

            <div>
              <p className={styles.label}>
                Admin Approval
              </p>

              <h4 className={styles.value}>
                {shipment?.approvedByAdmin
                  ? "Approved"
                  : "Pending"}
              </h4>
            </div>
          </div>

          {/* Delivered */}
          <div className={styles.infoRow}>
            <FaCalendarCheck />

            <div>
              <p className={styles.label}>
                Delivered Date
              </p>

              <h4 className={styles.value}>
                {formatDate(
                  shipment?.deliveredAt
                )}
              </h4>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShipmentSummaryCard;