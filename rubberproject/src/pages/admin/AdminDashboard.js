// src/pages/admin/AdminDashboard.js

import React, { useEffect, useState } from "react";
import {
  FaBoxOpen,
  FaCheckCircle,
  FaClock,
  FaArrowUp,
} from "react-icons/fa";
import styles from "../../styles/Admin/AdminDashboard.module.css";

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalApprovedProducts: 0,
    totalPendingProducts: 0,
    totalProducts: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [approvedRes, pendingRes] = await Promise.all([
          fetch(
            `${process.env.REACT_APP_API_URL}/api/products/admin/approved-products`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
          fetch(
            `${process.env.REACT_APP_API_URL}/api/products/admin/pending-products`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ]);

        const approvedData = await approvedRes.json();
        const pendingData = await pendingRes.json();

        const approvedCount = approvedData.products?.length || 0;
        const pendingCount = pendingData.products?.length || 0;

        setDashboardData({
          totalApprovedProducts: approvedCount,
          totalPendingProducts: pendingCount,
          totalProducts: approvedCount + pendingCount,
        });
      } catch (error) {
        console.log("Dashboard Fetch Error:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className={styles.adminDashboardWrapper}>
      <div className={styles.adminDashboardHeader}>
        <div>
          <h1 className={styles.adminDashboardTitle}>Admin Dashboard</h1>
          <p className={styles.adminDashboardSubtitle}>
            Monitor products, approvals and pending requests
          </p>
        </div>
      </div>

      <div className={styles.adminDashboardGrid}>
        <div className={styles.adminDashboardCard}>
          <div className={styles.adminDashboardCardTop}>
            <div className={styles.adminDashboardIconBox}>
              <FaBoxOpen className={styles.adminDashboardIcon} />
            </div>

            <div className={styles.adminDashboardGrowth}>
              <FaArrowUp />
              <span>Overall</span>
            </div>
          </div>

          <h3 className={styles.adminDashboardCardTitle}>Total Products</h3>
          <h2 className={styles.adminDashboardCardValue}>
            {dashboardData.totalProducts}
          </h2>
        </div>

        <div className={styles.adminDashboardCard}>
          <div className={styles.adminDashboardCardTop}>
            <div
              className={`${styles.adminDashboardIconBox} ${styles.adminApprovedIconBox}`}
            >
              <FaCheckCircle className={styles.adminDashboardIcon} />
            </div>

            <div
              className={`${styles.adminDashboardGrowth} ${styles.adminApprovedGrowth}`}
            >
              <FaArrowUp />
              <span>Approved</span>
            </div>
          </div>

          <h3 className={styles.adminDashboardCardTitle}>
            Approved Products
          </h3>
          <h2 className={styles.adminDashboardCardValue}>
            {dashboardData.totalApprovedProducts}
          </h2>
        </div>

        <div className={styles.adminDashboardCard}>
          <div className={styles.adminDashboardCardTop}>
            <div
              className={`${styles.adminDashboardIconBox} ${styles.adminPendingIconBox}`}
            >
              <FaClock className={styles.adminDashboardIcon} />
            </div>

            <div
              className={`${styles.adminDashboardGrowth} ${styles.adminPendingGrowth}`}
            >
              <FaClock />
              <span>Pending</span>
            </div>
          </div>

          <h3 className={styles.adminDashboardCardTitle}>
            Pending Products
          </h3>
          <h2 className={styles.adminDashboardCardValue}>
            {dashboardData.totalPendingProducts}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;