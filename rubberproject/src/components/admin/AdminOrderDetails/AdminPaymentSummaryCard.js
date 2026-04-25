import React from "react";
import {
  FaWallet,
  FaCheckCircle,
} from "react-icons/fa";

import styles from "../../../styles/Admin/AdminPaymentSummaryCard.module.css";

const AdminPaymentSummaryCard = ({ order }) => {
  const getStatusClass = (status) => {
    if (status === "completed") {
      return styles.completed;
    }

    if (status === "partial") {
      return styles.partial;
    }

    return styles.pending;
  };

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.cardHeader}>
        <div className={styles.iconBox}>
          <FaWallet />
        </div>

        <h3>
          Payment Summary
        </h3>
      </div>

      {/* Buyer Section */}
      <div className={styles.section}>
        <h4>
          Buyer Payment
        </h4>

        <div className={styles.row}>
          <span>Paid Amount</span>
          <strong>
            ₹ {order?.buyerPaidAmount || 0}
          </strong>
        </div>

        <div className={styles.row}>
          <span>Pending Amount</span>
          <strong>
            ₹ {order?.buyerPendingAmount || 0}
          </strong>
        </div>

        <div className={styles.statusRow}>
          <span>Status</span>

          <div
            className={`${styles.badge} ${getStatusClass(
              order?.buyerPaymentStatus
            )}`}
          >
            <FaCheckCircle />
            {order?.buyerPaymentStatus ||
              "pending"}
          </div>
        </div>
      </div>

      {/* Seller Section */}
      <div className={styles.section}>
        <h4>
          Seller Payment
        </h4>

        <div className={styles.row}>
          <span>Paid Amount</span>
          <strong>
            ₹ {order?.sellerPaidAmount || 0}
          </strong>
        </div>

        <div className={styles.row}>
          <span>Pending Amount</span>
          <strong>
            ₹ {order?.sellerPendingAmount || 0}
          </strong>
        </div>

        <div className={styles.statusRow}>
          <span>Status</span>

          <div
            className={`${styles.badge} ${getStatusClass(
              order?.sellerPaymentStatus
            )}`}
          >
            <FaCheckCircle />
            {order?.sellerPaymentStatus ||
              "pending"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentSummaryCard;