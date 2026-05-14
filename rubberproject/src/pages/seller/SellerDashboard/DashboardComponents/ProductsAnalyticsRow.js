import React from "react";

import PendingProductsSection from "./PendingProductsSection";

import TopSellingProductsSection from "./TopSellingProductsSection";

import styles from "./ProductsAnalyticsRow.module.css";

function ProductsAnalyticsRow() {
  return (
    <section className={styles.wrapper}>
      {/* LEFT */}

      <div className={styles.leftSection}>
        <PendingProductsSection />
      </div>

      {/* RIGHT */}

      <div className={styles.rightSection}>
        <TopSellingProductsSection />
      </div>
    </section>
  );
}

export default ProductsAnalyticsRow;