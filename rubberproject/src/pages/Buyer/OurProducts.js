import React, { useState } from "react";

import { useLocation } from "react-router-dom";

import ProductFilters from "../../components/products/ProductFilters";

import ProductGrid from "../../components/products/ProductGrid";

import styles from "../../styles/Buyer/OurProducts.module.css";

function OurProducts() {
  const location = useLocation();

  /* =========================
      URL QUERY PARAMS
  ========================== */

  const queryParams = new URLSearchParams(
    location.search
  );

  /* =========================
      FILTER STATE
  ========================== */

  const [filters, setFilters] = useState({
    category:
      queryParams.get("category") || "",

    application:
      queryParams.get("application") || "",

    loadingLocation: "",

    stockStatus: "",

    minPrice: "",

    maxPrice: "",

    search:
      queryParams.get("search") || "",
  });

  return (
    <div className={styles.pageWrapper}>
      {/* TOP SECTION */}

      <div className={styles.topSection}>
        <h1>Our Products</h1>

        <p>
          Explore premium rubber scrap
          products uploaded by verified
          sellers.
        </p>
      </div>

      {/* MAIN CONTENT */}

      <div className={styles.contentWrapper}>
        {/* LEFT FILTERS */}

        <div className={styles.leftSection}>
          <ProductFilters
            filters={filters}
            setFilters={setFilters}
          />
        </div>

        {/* RIGHT PRODUCTS */}

        <div className={styles.rightSection}>
          <ProductGrid filters={filters} />
        </div>
      </div>
    </div>
  );
}

export default OurProducts;