import React, { useEffect } from "react";

import {
  FaBoxOpen,
  FaCheckCircle,
  FaClock,
  FaShoppingCart,
} from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";

import {
  getSellerDashboardStatsThunk,
} from "../../../../redux/slices/sellerDashboardThunk";

import styles from "./StatsCardsSection.module.css";

function StatsCardsSection() {
  const dispatch = useDispatch();

  const {
    stats,
    statsLoading,
  } = useSelector(
    (state) => state.sellerDashboard
  );

  useEffect(() => {
    dispatch(
      getSellerDashboardStatsThunk()
    );
  }, [dispatch]);

  const cards = [
    {
      title: "Total Products",

      value: stats.totalProducts,

      icon: <FaBoxOpen />,

      color: styles.purple,
    },

    {
      title: "Approved Products",

      value: stats.approvedProducts,

      icon: <FaCheckCircle />,

      color: styles.green,
    },

    {
      title: "Pending Products",

      value: stats.pendingProducts,

      icon: <FaClock />,

      color: styles.orange,
    },

    {
      title: "Total Orders",

      value: stats.totalOrders,

      icon: <FaShoppingCart />,

      color: styles.blue,
    },
  ];

  return (
    <section className={styles.wrapper}>
      <div className={styles.grid}>
        {cards.map((card, index) => (
          <div
            className={styles.card}
            key={index}
          >
            {/* ICON */}

            <div
              className={`${styles.iconBox} ${card.color}`}
            >
              {card.icon}
            </div>

            {/* CONTENT */}

            <div
              className={styles.content}
            >
              <h4>{card.title}</h4>

              {statsLoading ? (
                <p>...</p>
              ) : (
                <h2>{card.value}</h2>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StatsCardsSection;