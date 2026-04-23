import React from "react";
import { FaTruck, FaCheck, FaTimes } from "react-icons/fa";
import styles from "../../styles/Buyer/BuyerOrders.module.css";

function OrderFilters({ activeFilter, setActiveFilter }) {
  return (
    <div className={styles.filterRow}>
      <button
        className={`${styles.filterBtn} ${
          activeFilter === "all" ? styles.activeFilter : ""
        }`}
        onClick={() => setActiveFilter("all")}
      >
        All
      </button>

      <button
        className={`${styles.filterBtn} ${
          activeFilter === "in_progress"
            ? styles.activeFilter
            : ""
        }`}
        onClick={() => setActiveFilter("in_progress")}
      >
        In Progress
      </button>

      <button
        className={`${styles.filterBtn} ${
          activeFilter === "partial_shipments"
            ? styles.activeFilter
            : ""
        }`}
        onClick={() => setActiveFilter("partial_shipments")}
      >
        <FaTruck />
        Partial Shipments
      </button>

      <button
        className={`${styles.filterBtn} ${
          activeFilter === "shipped"
            ? styles.activeFilter
            : ""
        }`}
        onClick={() => setActiveFilter("shipped")}
      >
        <FaTruck />
        Shipped
      </button>

      <button
        className={`${styles.filterBtn} ${
          activeFilter === "delivered"
            ? styles.activeFilter
            : ""
        }`}
        onClick={() => setActiveFilter("delivered")}
      >
        <FaCheck />
        Delivered
      </button>

      <button
        className={`${styles.filterBtn} ${
          activeFilter === "cancelled"
            ? styles.activeFilter
            : ""
        }`}
        onClick={() => setActiveFilter("cancelled")}
      >
        <FaTimes />
        Cancelled
      </button>
    </div>
  );
}

export default OrderFilters;