import React from "react";

import WelcomeSection from "./DashboardComponents/WelcomeSection";

import StatsCardsSection from "./DashboardComponents/StatsCardsSection";

import OrdersOverviewSection from "./DashboardComponents/OrdersOverviewSection";

import RecentOrdersSection from "./DashboardComponents/RecentOrdersSection";

import ProductsAnalyticsRow from "./DashboardComponents/ProductsAnalyticsRow";

import styles from "./SellerDashboard.module.css";

function SellerDashboard() {
  return (
    <div className={styles.dashboardContainer}>
      <WelcomeSection />

      <StatsCardsSection />

      <OrdersOverviewSection />

      <RecentOrdersSection />

      <ProductsAnalyticsRow />
    </div>
  );
}

export default SellerDashboard;