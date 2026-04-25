// src/components/admin/AdminOrdersSummaryCards.js

import React from "react";
import {
  FaFileInvoice,
  FaClock,
  FaCheckCircle,
  FaTruck,
  FaTimesCircle,
} from "react-icons/fa";

import styles from "../../styles/Admin/AdminOrdersSummaryCards.module.css";

const AdminOrdersSummaryCards = ({
  counts,
  status,
  setStatus,
}) => {
  const cards = [
    {
      key: "all",
      label: "All",
      value: counts?.all || 0,
      icon: <FaFileInvoice />,
    },
    {
      key: "pending",
      label: "Pending",
      value: counts?.pending || 0,
      icon: <FaClock />,
    },
    {
      key: "delivered",
      label: "Delivered",
      value: counts?.delivered || 0,
      icon: <FaCheckCircle />,
    },
    {
      key: "partially_shipped",
      label: "Partial Shipments",
      value: counts?.partialShipments || 0,
      icon: <FaTruck />,
    },
    {
      key: "cancelled",
      label: "Cancelled",
      value: counts?.cancelled || 0,
      icon: <FaTimesCircle />,
    },
  ];

  return (
    <div className={styles.wrapper}>
      {cards.map((card) => (
        <button
          key={card.key}
          className={`${styles.card} ${
            status === card.key
              ? styles.active
              : ""
          }`}
          onClick={() => setStatus(card.key)}
        >
          <div className={styles.iconBox}>
            {card.icon}
          </div>

          <div className={styles.content}>
            <span className={styles.label}>
              {card.label}
            </span>

            <span className={styles.count}>
              {card.value}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default AdminOrdersSummaryCards;