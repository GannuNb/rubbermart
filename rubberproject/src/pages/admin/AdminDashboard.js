import React from "react";

import DashboardOverview from "../../components/admin/dashboard/DashboardOverview/DashboardOverview";

import OrdersOverview from "../../components/admin/dashboard/OrdersOverview/OrdersOverview";

import RecentOrders from "../../components/admin/dashboard/RecentOrders/RecentOrders";

import PendingProducts from "../../components/admin/dashboard/PendingProducts/PendingProducts";

import styles from "../../styles/Admin/AdminDashboard.module.css";

function AdminDashboard() {
  return (
    <div className={styles.adminDashboard}>

      <div className={styles.adminDashboardHeader}>
        <h1>Admin Dashboard</h1>

        <p>
          Monitor products, orders and platform activity
        </p>
      </div>

      <DashboardOverview />

      <div className={styles.adminDashboardMiddle}>
        <OrdersOverview />

        <RecentOrders />
      </div>

      <PendingProducts />

    </div>
  );
}

export default AdminDashboard;