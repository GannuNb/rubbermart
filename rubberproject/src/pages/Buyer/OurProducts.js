import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductFilters from "../../components/products/ProductFilters";
import ProductGrid from "../../components/products/ProductGrid";
import styles from "../../styles/Buyer/OurProducts.module.css";

function OurProducts() {
  const location = useLocation();

  const [filters, setFilters] = useState({
    category: "",
    application: "",
    loadingLocation: "",
    stockStatus: "",
    minPrice: "",
    maxPrice: "",
    search: "",
  });

  // 1. Sync state with URL params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setFilters((prev) => ({
      ...prev,
      search: queryParams.get("search") || "",
      category: queryParams.get("category") || "",
      application: queryParams.get("application") || "",
    }));
  }, [location.search]);

  // 2. Cleanup: Reset filters when navigating away
  useEffect(() => {
    return () => {
      setFilters({
        category: "",
        application: "",
        loadingLocation: "",
        stockStatus: "",
        minPrice: "",
        maxPrice: "",
        search: "",
      });
    };
  }, [location.pathname]);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.topSection}>
        <h1>Our Products</h1>
        <p>Explore premium rubber scrap products uploaded by verified sellers.</p>
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
  );
}

export default OurProducts;