// src/components/ProductGrid.js

import React, { useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaBoxes,
  FaArrowRight,
  FaSpinner,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchApprovedProducts } from "../redux/slices/buyerProductThunk";
import styles from "../styles/ProductGrid.module.css";

function ProductGrid({ filters }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    approvedProducts = [],
    approvedProductsLoading = false,
    approvedProductsError = null,
  } = useSelector((state) => state.buyerProducts || {});

  useEffect(() => {
    dispatch(fetchApprovedProducts());
  }, [dispatch]);

  const filteredProducts = approvedProducts.filter((product) => {
    const matchesCategory =
      !filters.category || product.category === filters.category;

    const matchesApplication =
      !filters.application ||
      product.application === filters.application;

    const matchesLocation =
      !filters.loadingLocation ||
      product.loadingLocation === filters.loadingLocation;

    const matchesStock =
      !filters.stockStatus ||
      product.stockStatus === filters.stockStatus;

    const matchesSearch =
      !filters.search ||
      product.application
        ?.toLowerCase()
        .includes(filters.search.toLowerCase());

    const matchesMinPrice =
      !filters.minPrice ||
      Number(product.pricePerMT) >= Number(filters.minPrice);

    const matchesMaxPrice =
      !filters.maxPrice ||
      Number(product.pricePerMT) <= Number(filters.maxPrice);

    return (
      matchesCategory &&
      matchesApplication &&
      matchesLocation &&
      matchesStock &&
      matchesSearch &&
      matchesMinPrice &&
      matchesMaxPrice
    );
  });

  if (approvedProductsLoading) {
    return (
      <div className={styles.loaderWrapper}>
        <FaSpinner className={styles.loaderIcon} />
        <p>Loading approved products...</p>
      </div>
    );
  }

  if (approvedProductsError) {
    return (
      <div className={styles.errorBox}>
        <p>{approvedProductsError}</p>
      </div>
    );
  }

  return (
    <div className={styles.productSection}>
      <div className={styles.topBar}>
        <h2>Available Products</h2>
        <span>{filteredProducts.length} Products Found</span>
      </div>

      {filteredProducts.length === 0 ? (
        <div className={styles.emptyBox}>
          <h3>No products found</h3>
          <p>Try changing filters or search keywords.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredProducts.map((product) => (
            <div key={product._id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img
                  src={
                    product.images?.[0]?.image ||
                    "https://via.placeholder.com/400x300?text=No+Image"
                  }
                  alt={product.application}
                />

                <span
                  className={`${styles.stockBadge} ${
                    product.stockStatus === "available"
                      ? styles.available
                      : styles.soldout
                  }`}
                >
                  {product.stockStatus}
                </span>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.category}>{product.category}</div>

                <h3>{product.application}</h3>

                <div className={styles.infoRow}>
                  <FaBoxes />
                  <span>{product.quantity} MT Available</span>
                </div>

                <div className={styles.infoRow}>
                  <FaMapMarkerAlt />
                  <span>{product.loadingLocation}</span>
                </div>

                <div className={styles.infoRow}>
                  <span>Origin: {product.countryOfOrigin}</span>
                </div>

                <div className={styles.bottomRow}>
                  <div>
                    <p className={styles.priceLabel}>Price / MT</p>
                    <h4>₹{Number(product.pricePerMT).toLocaleString()}</h4>
                  </div>

                  <button
                    className={styles.detailsBtn}
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    More Details
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductGrid;