import React from "react";
import {
  FaFileInvoice,
  FaCheckCircle,
  FaWallet,
  FaCalendarAlt,
} from "react-icons/fa";

import styles from "../../../styles/Admin/AdminOrderDetails.module.css";

const AdminOrderSummaryCard = ({ order }) => {
  const formatDate = (date) => {
    if (!date) return "-";

    const newDate = new Date(date);

    return `${newDate.toLocaleDateString(
      "en-IN"
    )}, ${newDate.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    )}`;
  };

  const getOrderStatusLabel = (status) => {
    if (!status) return "-";

    return status.replaceAll("_", " ");
  };

  const getPaymentStatus = () => {
    if (
      order?.buyerPaymentStatus ===
      "completed"
    ) {
      return "Completed";
    }

    if (
      order?.buyerPaymentStatus === "partial"
    ) {
      return "Partial";
    }

    return "Pending";
  };

  return (
    <div className={styles.summaryCard}>
      {/* Order ID */}
      <div className={styles.summaryItem}>
        <div className={styles.itemTop}>
          <FaFileInvoice />
          <span>Order ID</span>
        </div>

        <h3 className={styles.orderId}>
          {order?.orderId || "-"}
        </h3>
      </div>

      {/* Order Status */}
      <div className={styles.summaryItem}>
        <div className={styles.itemTop}>
          <FaCheckCircle />
          <span>Order Status</span>
        </div>

        <span
          className={`${styles.badge} ${styles.progress}`}
        >
          {getOrderStatusLabel(
            order?.orderStatus
          )}
        </span>
      </div>

      {/* Payment Status */}
      <div className={styles.summaryItem}>
        <div className={styles.itemTop}>
          <FaWallet />
          <span>Payment Status</span>
        </div>

        <span
          className={`${styles.badge} ${styles.pending}`}
        >
          {getPaymentStatus()}
        </span>
      </div>

      {/* Order Date */}
      <div className={styles.summaryItem}>
        <div className={styles.itemTop}>
          <FaCalendarAlt />
          <span>Order Date</span>
        </div>

        <p className={styles.dateText}>
          {formatDate(order?.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default AdminOrderSummaryCard;