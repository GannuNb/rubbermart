import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  FaBoxOpen,
  FaCheckCircle,
  FaClock,
  FaShoppingCart,
  FaUsers,
} from "react-icons/fa";

import styles from "./DashboardOverview.module.css";

function DashboardOverview() {
  const navigate = useNavigate(); // Initialize hook
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
      path: "/admin-products",
    },
    {
      title: "Approve Products",
      value: overview.approvedProducts,
      icon: <FaCheckCircle />,
      className: styles.greenCard,
      path: "/admin-approve-products",
    },
    {
      title: "Pending Products",
      value: overview.pendingProducts,
      icon: <FaClock />,
      className: styles.orangeCard,
      path: "/admin-products",
    },
    {
      title: "Total Orders",
      value: overview.totalOrders,
      icon: <FaShoppingCart />,
      className: styles.purpleCard,
      path: "/admin/orders",
    },
    {
      title: "Total Users",
      value: overview.totalUsers,
      icon: <FaUsers />,
      className: styles.darkCard,
      path: "/admin-users",
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
            onClick={() => navigate(card.path)} // Trigger routing action
            style={{ cursor: "pointer" }} // Change cursor type to pointer
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