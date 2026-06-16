import React from "react";
import StatsCardsSection from "./StatsCardsSection";
import ShipmentsOverviewSection from "./ShipmentsOverviewSection";
import ActivityTablesSection from "./ActivityTablesSection";
import RevenueOverviewSection from "./RevenueOverviewSection";
import styles from "./TransporterDashboard.module.css";

function TransporterDashboard() {
  return (
    <div className={styles.dashboardPageWrapper}>
      <header className={styles.header}>
        <h1>Transporter Dashboard</h1>
        <p>Monitor your fleet operations, active shipments, and financial performance.</p>
      </header>

      <StatsCardsSection />

      <div className={styles.mainGrid}>
        <div className={styles.fullWidthSection}>
          <ShipmentsOverviewSection />
        </div>
        
        <div className={styles.fullWidthSection}>
          <ActivityTablesSection />
        </div>

        <div className={styles.fullWidthSection}>
          <RevenueOverviewSection />
        </div>
      </div>
    </div>
  );
}

export default TransporterDashboard;