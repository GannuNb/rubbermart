import React from "react";
import { FaBox, FaCalendarAlt, FaFileAlt, FaRupeeSign } from "react-icons/fa";
import styles from "../../styles/Buyer/BuyerOrderDetails.module.css";

function OrderSummaryHeader({ order }) {
  return (
    <div className={styles.summaryCard}>
      {/* ORDER ID */}
      <div className={styles.summaryItem}>
        <div className={styles.iconBox}>
          <FaBox />
        </div>
        <div>
          <p className={styles.label}>Order ID</p>
          <h4 className={styles.linkText}>{order.orderId}</h4>
        </div>
      </div>

      
        {/* TOTAL AMOUNT */}
        <div className={styles.summaryItem}>
        <div className={styles.iconBox}>
            <FaRupeeSign />
        </div>

        <div>
            <p className={styles.label}>Total Amount</p>
            <h3 className={styles.amount}>
            ₹{Number(order.totalAmount).toLocaleString()}
            </h3>
        </div>
        </div>

      {/* ORDER DATE */}
      <div className={styles.summaryItem}>
        <div className={styles.iconBox}>
          <FaCalendarAlt />
        </div>
        <div>
          <p className={styles.label}>Ordered Date</p>
          <h4>
            {new Date(order.createdAt).toLocaleDateString()}
          </h4>
        </div>
      </div>

      {/* REPORTS */}
      <div className={styles.summaryItem}>
        <div className={styles.iconBox}>
          <FaFileAlt />
        </div>
        <div>
          <p className={styles.label}>Reports</p>
          <h4 className={styles.linkText}>Buy Reports</h4>
        </div>
      </div>
    </div>
  );
}

export default OrderSummaryHeader;