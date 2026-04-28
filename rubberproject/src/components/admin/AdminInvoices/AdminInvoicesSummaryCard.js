import React from "react";
import {
  FaRegFileAlt,
  FaUser,
  FaRegCalendarAlt,
} from "react-icons/fa";

import styles from "../../../styles/Admin/AdminAllInvoices.module.css";

const AdminInvoicesSummaryCard = ({
  order,
}) => {
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const getReadableStatus = (status) => {
    if (!status) return "-";

    return status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  return (
    <div className={styles.summaryCard}>
      {/* Order ID */}
      <div className={styles.summaryItem}>
        <div className={styles.iconWrap}>
          <FaRegFileAlt />
        </div>

        <div>
          <p className={styles.label}>
            Order ID
          </p>

          <h4 className={styles.valueLink}>
            {order?.orderId || "-"}
          </h4>
        </div>
      </div>

      {/* Buyer */}
      <div className={styles.summaryItem}>
        <div className={styles.iconWrap}>
          <FaUser />
        </div>

        <div>
          <p className={styles.label}>
            Buyer
          </p>

          <h4 className={styles.value}>
            {order?.buyer?.fullName || "-"}
          </h4>
        </div>
      </div>

      {/* Date */}
      <div className={styles.summaryItem}>
        <div className={styles.iconWrap}>
          <FaRegCalendarAlt />
        </div>

        <div>
          <p className={styles.label}>
            Order Date
          </p>

          <h4 className={styles.value}>
            {formatDate(order?.createdAt)}
          </h4>
        </div>
      </div>

      {/* Status */}
      <div className={styles.summaryItem}>
        <div>
          <p className={styles.label}>
            Order Status
          </p>

          <span className={styles.statusBadge}>
            {getReadableStatus(
              order?.orderStatus
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminInvoicesSummaryCard;