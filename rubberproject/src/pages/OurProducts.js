// src/pages/OurProducts.js

import React, { useState } from "react";
import RoleNavbar from "../components/RoleNavbar";
import ProductFilters from "../components/ProductFilters";
import ProductGrid from "../components/ProductGrid";
import styles from "../styles/OurProducts.module.css";

function OurProducts() {
  const [filters, setFilters] = useState({
    category: "",
    application: "",
    loadingLocation: "",
    stockStatus: "",
    minPrice: "",
    maxPrice: "",
    search: "",
  });

  return (
    <>

      <div className={styles.pageWrapper}>
        <div className={styles.topSection}>
          <h1>Our Products</h1>
          <p>
            Explore premium rubber scrap products uploaded by verified sellers.
          </p>
        </div>

        <div className={styles.contentWrapper}>
          <div className={styles.leftSection}>
            <ProductFilters filters={filters} setFilters={setFilters} />
          </div>

          <div className={styles.rightSection}>
            <ProductGrid filters={filters} />
          </div>
        </div>
      </div>
    </>
  );
}

export default OurProducts;