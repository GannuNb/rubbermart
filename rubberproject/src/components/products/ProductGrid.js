// src/components/products/ProductGrid.js

import React, { useEffect } from "react";

import {
  FaMapMarkerAlt,
  FaBoxes,
  FaArrowRight,
  FaSpinner,
} from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import { fetchApprovedProducts } from "../../redux/slices/buyerProductThunk";

import styles from "../../styles/Buyer/ProductGrid.module.css";

function ProductGrid({ filters }) {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const {
    approvedProducts = [],
    approvedProductsLoading = false,
    approvedProductsError = null,
  } = useSelector((state) => state.buyerProducts || {});

  /* =========================
      FETCH PRODUCTS
  ========================== */

  useEffect(() => {
    dispatch(fetchApprovedProducts());
  }, [dispatch]);

  /* =========================
      FILTER PRODUCTS
  ========================== */

  const filteredProducts = approvedProducts.filter((product) => {
    // SEARCH

    const searchText = filters.search?.toLowerCase().trim() || "";

    const matchesSearch =
      !searchText ||
      product.application?.toLowerCase().includes(searchText) ||
      product.category?.toLowerCase().includes(searchText) ||
      product.productName?.toLowerCase().includes(searchText);

    // CATEGORY

    const matchesCategory =
      !filters.category || product.category === filters.category;

    // APPLICATION

    const matchesApplication =
      !filters.application ||
      product.application === filters.application ||
      product.application
        ?.toLowerCase()
        .includes(filters.application.toLowerCase());

    // LOCATION

    const matchesLocation =
      !filters.loadingLocation ||
      product.loadingLocation === filters.loadingLocation;

    // STOCK

    const matchesStock =
      !filters.stockStatus || product.stockStatus === filters.stockStatus;

    // PRICE

    const matchesMinPrice =
      !filters.minPrice ||
      Number(product.pricePerMT) >= Number(filters.minPrice);

    const matchesMaxPrice =
      !filters.maxPrice ||
      Number(product.pricePerMT) <= Number(filters.maxPrice);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesApplication &&
      matchesLocation &&
      matchesStock &&
      matchesMinPrice &&
      matchesMaxPrice
    );
  });

  /* =========================
      LOADING
  ========================== */

  if (approvedProductsLoading) {
    return (
      <div className={styles.loaderWrapper}>
        <FaSpinner className={styles.loaderIcon} />

        <p>Loading approved products...</p>
      </div>
    );
  }

  /* =========================
      ERROR
  ========================== */

  if (approvedProductsError) {
    return (
      <div className={styles.errorBox}>
        <p>{approvedProductsError}</p>
      </div>
    );
  }

  return (
    <div className={styles.productSection}>
      {/* =========================
          TOP BAR
      ========================== */}

      <div className={styles.topBar}>
        <h2>Available Products</h2>

        <span>{filteredProducts.length} Products Found</span>
      </div>

      {/* =========================
          EMPTY
      ========================== */}

      {filteredProducts.length === 0 ? (
        <div className={styles.emptyBox}>
          <h3>No products found</h3>

          <p>Try changing filters or search keywords.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredProducts.map((product) => (
            <div key={product._id} className={styles.card}>
              {/* IMAGE */}

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

              {/* BODY */}

              <div className={styles.cardBody}>
                {/* CATEGORY */}

                <div className={styles.category}>{product.category}</div>

                {/* TITLE */}

                <h3>{product.application}</h3>

                {/* QUANTITY */}

                <div className={styles.infoRow}>
                  <FaBoxes />

                  <span>{product.quantity} MT Available</span>
                </div>

                {/* LOCATION */}

                <div className={styles.infoRow}>
                  <FaMapMarkerAlt />

                  <span>{product.loadingLocation}</span>
                </div>

                {/* ORIGIN */}

                <div className={styles.infoRow}>
                  <span>Origin: {product.countryOfOrigin}</span>
                </div>

                {/* BOTTOM */}

                <div className={styles.bottomRow}>
                  {/* PRICE */}

                  <div>
                    <p className={styles.priceLabel}>Price / MT</p>

                    <h4>₹{Number(product.pricePerMT).toLocaleString()}</h4>
                  </div>

                  {/* DETAILS */}

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
