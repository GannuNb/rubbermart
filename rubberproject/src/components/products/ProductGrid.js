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
      PAGINATION STATE
  ========================== */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Get buyer products state
  const {
    approvedProducts = [],
    approvedProductsLoading = false,
    approvedProductsError = null,
  } = useSelector((state) => state.buyerProducts || {});

  // Fetch authentication state
  const { token } = useSelector((state) => state.auth || {});

  /* =========================
      FETCH PRODUCTS
  ========================== */
  useEffect(() => {
    dispatch(fetchApprovedProducts());
  }, [dispatch]);

  /* =========================
      RESET PAGE ON FILTER CHANGE
  ========================== */
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  /* =========================
      FILTER PRODUCTS
  ========================== */

const filteredProducts = approvedProducts.filter((product) => {
  const searchText = filters.search?.toLowerCase().trim() || "";
  let matchesSearch = true;

  if (searchText) {
    const searchWords = searchText.split(/\s+/);
    
    const appText = (product.application || "").toLowerCase();
    const catText = (product.category || "").toLowerCase();
    const nameText = (product.productName || "").toLowerCase();

    // CHANGE: Use .some() so if ANY word matches, it's a valid result.
    // This allows "oil" to match "Pyro Oil" even if "car" is also typed.
    matchesSearch = searchWords.some((word) => 
      appText.includes(word) || 
      catText.includes(word) || 
      nameText.includes(word)
    );
  }

  // ... (rest of your logic remains exactly the same)
  const matchesCategory = !filters.category || product.category === filters.category;
  const matchesApplication = !filters.application || product.application === filters.application;
  const matchesLocation = !filters.loadingLocation || product.loadingLocation === filters.loadingLocation;
  const matchesStock = !filters.stockStatus || product.stockStatus === filters.stockStatus;
  const matchesMinPrice = !filters.minPrice || Number(product.pricePerMT) >= Number(filters.minPrice);
  const matchesMaxPrice = !filters.maxPrice || Number(product.pricePerMT) <= Number(filters.maxPrice);

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
      PAGINATION METRICS
  ========================== */
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDetailsClick = (productId) => {
    if (token) {
      navigate(`/product/${productId}`);
    } else {
      navigate("/login");
    }
  };

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
      {/* TOP BAR */}
      <div className={styles.topBar}>
        <h2>Available Products</h2>
        <span>{filteredProducts.length} Products Found</span>
      </div>

      {/* MAIN CONTAINER GRID */}
      {filteredProducts.length === 0 ? (
        <div className={styles.emptyBox}>
          <h3>No products found</h3>
          <p>Try changing filters or search keywords.</p>
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {currentProducts.map((product) => (
              <div
                key={product._id}
                className={styles.card}
                onClick={() => handleDetailsClick(product._id)}
                style={{ cursor: "pointer" }}
              >
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

                {/* CARD BODY */}
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

          {/* PAGINATION CONTROL */}
          <div className={styles.paginationWrapper}>
            <button
              className={styles.pageArrowButton}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &laquo; Previous
            </button>

            <div className={styles.pageNumbersGrid}>
              {(() => {
                let startPage = Math.max(1, currentPage);
                if (currentPage === totalPages && totalPages > 1) {
                  startPage = Math.max(1, currentPage - 1);
                }
                const endPage = Math.min(totalPages, startPage + 1);

                const pageNumbers = [];
                for (let i = startPage; i <= endPage; i++) {
                  pageNumbers.push(
                    <button
                      key={i}
                      className={`${styles.pageNumberPill} ${
                        currentPage === i ? styles.activePageNumberPill : ""
                      }`}
                      onClick={() => handlePageChange(i)}
                    >
                      {i}
                    </button>
                  );
                }
                return pageNumbers;
              })()}
            </div>

            <button
              className={styles.pageArrowButton}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next &raquo;
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ProductGrid;