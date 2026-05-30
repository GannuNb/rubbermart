import React, { useEffect, useState } from "react";
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

  /* =========================
     PAGE STATE
  ========================== */
  const [page, setPage] = useState(1);

  /* =========================
     REDUX STATE
  ========================== */
  const {
    approvedProducts = [],
    approvedProductsLoading = false,
    approvedProductsError = null,
    totalPages = 1,
    totalProducts = 0,
  } = useSelector((state) => state.buyerProducts || {});

  /* =========================
     AUTH STATE
  ========================== */
  const { token, user } = useSelector((state) => state.auth || {});

  /* =========================
     RESET PAGE
  ========================== */
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    if (!initialLoadDone) {
      setInitialLoadDone(true);
      return;
    }
    setPage(1);
  }, [
    filters.category,
    filters.application,
    filters.loadingLocation,
    filters.stockStatus,
    filters.minPrice,
    filters.maxPrice,
    filters.search,
  ]);

  /* =========================
     FETCH PRODUCTS
  ========================== */
  useEffect(() => {
    dispatch(
      fetchApprovedProducts({
        page,
        limit: 4,
        category: filters.category || "",
        application: filters.application || "",
        loadingLocation: filters.loadingLocation || "",
        stockStatus: filters.stockStatus || "",
        minPrice: filters.minPrice || "",
        maxPrice: filters.maxPrice || "",
        search: filters.search || "",
      }),
    );
  }, [
    dispatch,
    page,
    filters.category,
    filters.application,
    filters.loadingLocation,
    filters.stockStatus,
    filters.minPrice,
    filters.maxPrice,
    filters.search,
  ]);

  /* =========================
     PAGE CHANGE
  ========================== */
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setPage(pageNumber);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================
     NAVIGATION LOGIC
  ========================== */
  const handleNavigation = (destination) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (user && user.businessProfileCompleted !== true) {
      navigate("/business-profile");
      return;
    }

    navigate(destination);
  };

  const handleDetailsClick = (productId) => {
    handleNavigation(`/product/${productId}`);
  };

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
      <div className={styles.topBar}>
        <h2>Available Products</h2>
        <span>{totalProducts} Products Found</span>
      </div>

      {approvedProducts.length === 0 ? (
        <div className={styles.emptyBox}>
          <h3>No products found</h3>
          <p>Try changing filters or search keywords.</p>
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {approvedProducts.map((product) => (
              <div
                key={product._id}
                className={styles.card}
                onClick={() => handleDetailsClick(product._id)}
                style={{ cursor: "pointer" }}
              >
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
                    <div className={styles.detailsBtn}>
                      More Details
                      <FaArrowRight />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.paginationWrapper}>
              <button
                className={styles.pageArrowButton}
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                &laquo; Previous
              </button>
              <div className={styles.pageNumbersGrid}>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    className={`${styles.pageNumberPill} ${
                      page === index + 1 ? styles.activePageNumberPill : ""
                    }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button
                className={styles.pageArrowButton}
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
              >
                Next &raquo;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ProductGrid;