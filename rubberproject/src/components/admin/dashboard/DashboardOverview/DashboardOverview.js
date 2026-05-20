import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import {
  FaBoxOpen,
  FaCheckCircle,
  FaClock,
  FaShoppingCart,
  FaUsers,
  FaTimesCircle, // Icon is imported correctly here
} from "react-icons/fa";

import styles from "./DashboardOverview.module.css";

function DashboardOverview() {
  const navigate = useNavigate(); 
  const [overview, setOverview] = useState({
    totalProducts: 0,
    approvedProducts: 0,
    pendingProducts: 0,
    rejectedProducts: 0, // FIXED: Ensure this is explicitly defined in your initial state!
    totalOrders: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    fetchDashboardOverview();
  }, []);

  const fetchDashboardOverview = async () => {
    try {
      const token = localStorage.getItem("token");
      const baseUrl = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/\/$/, "") : "";

      const response = await fetch(
        `${baseUrl}/api/admin-dashboard/overview`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
      title: "Approved Products",
      value: overview.approvedProducts,
      icon: <FaCheckCircle />,
      className: styles.greenCard,
      path: "/admin-approved-products",
    },
    {
      title: "Pending Products",
      value: overview.pendingProducts,
      icon: <FaClock />,
      className: styles.orangeCard,
      path: "/admin-pending-products",
    },
    {
      title: "Rejected Products",
      value: overview.rejectedProducts, // Using the cleanly tracked value now
      icon: <FaTimesCircle />, 
      className: styles.redCard, // This class will now load properly from your updated CSS file
      path: "/admin-rejected-products",
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
            onClick={() => navigate(card.path)} 
            style={{ cursor: "pointer" }} 
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