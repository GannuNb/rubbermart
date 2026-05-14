import React, { useEffect, useState } from "react";

import {
  FaBoxOpen,
  FaCheckCircle,
  FaClock,
  FaShoppingCart,
  FaUsers,
} from "react-icons/fa";

import styles from "./DashboardOverview.module.css";

function DashboardOverview() {
  const [overview, setOverview] = useState({
    totalProducts: 0,
    approvedProducts: 0,
    pendingProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    fetchDashboardOverview();
  }, []);

  const fetchDashboardOverview = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin-dashboard/overview`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (data.success) {
        setOverview(data.overview);
      }
    } catch (error) {
      console.log("Dashboard Overview Error:", error);
    }
  };

  const cards = [
    {
      title: "Total Products",
      value: overview.totalProducts,
      icon: <FaBoxOpen />,
      className: styles.blueCard,
    },

    {
      title: "Approved Products",
      value: overview.approvedProducts,
      icon: <FaCheckCircle />,
      className: styles.greenCard,
    },

    {
      title: "Pending Products",
      value: overview.pendingProducts,
      icon: <FaClock />,
      className: styles.orangeCard,
    },

    {
      title: "Total Orders",
      value: overview.totalOrders,
      icon: <FaShoppingCart />,
      className: styles.purpleCard,
    },

    {
      title: "Total Users",
      value: overview.totalUsers,
      icon: <FaUsers />,
      className: styles.darkCard,
    },
  ];

  return (
    <div className={styles.dashboardOverviewSection}>
      <div className={styles.dashboardOverviewGrid}>
        {cards.map((card, index) => (
          <div
            key={index}
            className={`
              ${styles.dashboardCard}
              ${card.className}
            `}
          >
            <div className={styles.dashboardCardTop}>
              <div className={styles.dashboardIcon}>{card.icon}</div>
            </div>

            <h3>{card.title}</h3>

            <h2>{card.value}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardOverview;
