import React, { useRef } from "react";
import { FaTruck, FaCheck, FaTimes } from "react-icons/fa";
import styles from "../../styles/Buyer/BuyerOrders.module.css";

function OrderFilters({ activeFilter, setActiveFilter }) {
  const containerRef = useRef(null);

  const handleClick = (value, e) => {
    setActiveFilter(value);

    // auto scroll to center
    const container = containerRef.current;
    const button = e.currentTarget;

    if (container && button) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();

      const offset =
        buttonRect.left -
        containerRect.left -
        containerRect.width / 2 +
        buttonRect.width / 2;

      container.scrollBy({
        left: offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <div ref={containerRef} className={styles.filterRow}>
      <button
        className={`${styles.filterBtn} ${
          activeFilter === "all" ? styles.activeFilter : ""
        }`}
        onClick={(e) => handleClick("all", e)}
      >
        All
      </button>

      <button
        className={`${styles.filterBtn} ${
          activeFilter === "in_progress" ? styles.activeFilter : ""
        }`}
        onClick={(e) => handleClick("in_progress", e)}
      >
        In Progress
      </button>

      <button
        className={`${styles.filterBtn} ${
          activeFilter === "partial_shipments" ? styles.activeFilter : ""
        }`}
        onClick={(e) => handleClick("partial_shipments", e)}
      >
        <FaTruck />
        Partial Shipments
      </button>

      <button
        className={`${styles.filterBtn} ${
          activeFilter === "shipped" ? styles.activeFilter : ""
        }`}
        onClick={(e) => handleClick("shipped", e)}
      >
        <FaTruck />
        Shipped
      </button>

      <button
        className={`${styles.filterBtn} ${
          activeFilter === "delivered" ? styles.activeFilter : ""
        }`}
        onClick={(e) => handleClick("delivered", e)}
      >
        <FaCheck />
        Delivered
      </button>

      <button
        className={`${styles.filterBtn} ${
          activeFilter === "cancelled" ? styles.activeFilter : ""
        }`}
        onClick={(e) => handleClick("cancelled", e)}
      >
        <FaTimes />
        Cancelled
      </button>
    </div>
  );
}

export default OrderFilters;