import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiTruck, FiFileText, FiLayers, FiCheckCircle } from "react-icons/fi";
import { BiRupee } from "react-icons/bi";
import { Link } from "react-router-dom";
import styles from "./StatsCardsSection.module.css";

function StatsCardsSection() {
  const [stats, setStats] = useState({
    openShipments: 0,
    pendingRequests: 0,
    assignedShipments: 0,
    completedShipments: 0,
    revenue: "₹0",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:4000";
    const token = localStorage.getItem("token");

    axios.get(`${baseUrl}/api/transporter-dashboard/stats`, {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
      withCredentials: true
    })
      .then((res) => {
        if (res.data.success) {
          // Mapping the response stats object directly
          setStats(res.data.stats);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching stats:", err);
        setLoading(false);
      });
  }, []);

// ... inside StatsCardsSection component

const cards = [
  { label: "Open Shipments", val: stats.pendingRequests, icon: <FiFileText />, color: styles.purpleIcon, path: "/transporter-shipments" },
  { label: "Admin Quote Requests", val: stats.adminPending, icon: <FiLayers />, color: styles.orangeIcon, path: "/transporter-pending-assignments"  },
  { label: "Assigned", val: stats.assignedShipments, icon: <FiLayers />, color: styles.purpleIcon , path: "/transporter-assigned-shipments" },
  { label: "Completed", val: stats.completedShipments, icon: <FiCheckCircle />, color: styles.purpleIcon, path: "/transporter-completed-deliveries"  },
  { label: "Revenue", val: stats.revenue, icon: <BiRupee />, color: styles.greenIcon, isRevenue: true, path: "/transporter/payments"  },
];

// ...

  return (
    <section className={styles.grid}>
  {cards.map((c, i) => {
    const cardContent = (
      <>
        <div className={`${styles.iconWrapper} ${c.color}`}>{c.icon}</div>
        <div className={styles.info}>
          <span className={styles.label}>{c.label}</span>
          <h2 className={c.isRevenue ? styles.revenueText : ""}>
            {loading ? "..." : c.val}
          </h2>
        </div>
      </>
    );

    return (
      <div className={styles.card}>
  <Link 
    to={c.path} 
    style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}
  >
    <div className={`${styles.iconWrapper} ${c.color}`}>
      {c.icon}
    </div>
    <div className={styles.info}>
      <span className={styles.label}>{c.label}</span>
      <h2 className={c.isRevenue ? styles.revenueText : ""}>
        {loading ? "..." : c.val}
      </h2>
    </div>
  </Link>
</div>
    );
  })}
</section>
  );
}

export default StatsCardsSection;