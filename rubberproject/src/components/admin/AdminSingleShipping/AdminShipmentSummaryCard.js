import React from "react";
import {
  FaCheckCircle,
  FaClock,
  FaCalendarCheck,
} from "react-icons/fa";

import styles from "../../../styles/Admin/AdminSingleShippingInvoice.module.css";

const AdminShipmentSummaryCard = ({
  shipment,
}) => {
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN"
    );
  };

  const getReadableStatus = (
    status
  ) => {
    if (!status) return "-";

    return status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  return (
    <div className={styles.infoCard}>
      <h3 className={styles.cardTitle}>
        Shipment Summary
      </h3>

      <div className={styles.infoList}>
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
    </div>
  );
};

export default AdminShipmentSummaryCard;