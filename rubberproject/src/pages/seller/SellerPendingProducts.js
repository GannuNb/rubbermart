// src/pages/seller/SellerPendingProducts.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingProductsThunk } from "../../redux/slices/pendingProductsThunk"; 
import styles from "../../styles/Seller/SellerPendingProducts.module.css";

function SellerPendingProducts() {
  const dispatch = useDispatch();
  
  const [expandedCard, setExpandedCard] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Correctly pulling from the isolated pendingProducts bucket
  const { 
    items: pendingProducts, 
    totalPages 
  } = useSelector((state) => state.sellerProduct.pendingProducts);

  // Pulling loading/error states from the root slice
  const { 
    pendingProductsLoading, 
    pendingProductsError 
  } = useSelector((state) => state.sellerProduct);

  // Fetch pending products whenever the currentPage changes
  useEffect(() => {
    dispatch(fetchPendingProductsThunk(currentPage, "pending"));
  }, [dispatch, currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // The Thunk dispatch inside useEffect will handle the update, 
    // but we can also trigger it here to ensure immediate state syncing
    dispatch(fetchPendingProductsThunk(pageNumber, "pending"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggle = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  if (pendingProductsLoading && pendingProducts.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading pending products...</p>
      </div>
    );
  }

  if (pendingProductsError) {
    return (
      <div className={styles.loadingContainer}>
        <p>{pendingProductsError}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Pending Products</h1>

      {pendingProducts.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No pending products found</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {pendingProducts.map((product) => (
            <div className={styles.card} key={product._id}>
              <div className={styles.imageWrapper}>
                <div className={`${styles.statusBadge} ${styles.statusPending}`}>
                  Pending
                </div>
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0].image}
                    alt={product.application}
                    className={styles.image}
                    loading="lazy"
                  />
                ) : (
                  <div className={styles.noImage}>No Image</div>
                )}
              </div>

              <div className={styles.content}>
                <h2>{product.application}</h2>
                <p><strong>Category:</strong> {product.category}</p>
                <p><strong>Loading Location:</strong> {product.loadingLocation}</p>
                <p><strong>Status:</strong> <span className={styles.pending}>Pending Approval</span></p>

                {expandedCard === product._id && (
                  <>
                    <p><strong>Quantity:</strong> {product.quantity} MT</p>
                    <p><strong>Country:</strong> {product.countryOfOrigin}</p>
                    <p><strong>Price Per MT:</strong> ₹{product.pricePerMT}</p>
                    <p><strong>HSN Code:</strong> {product.hsnCode}</p>
                    {product.description && <p className={styles.description}>{product.description}</p>}
                  </>
                )}

                <button
                  className={styles.viewMoreBtn}
                  onClick={() => handleToggle(product._id)}
                >
                  {expandedCard === product._id ? "View Less" : "View Details"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      {pendingProducts.length > 0 && (
        <div className={styles.paginationWrapper}>
          <button
            className={styles.pageArrowButton}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &laquo; Previous
          </button>

          <div className={styles.pageNumbersGrid}>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                className={`${styles.pageNumberPill} ${
                  currentPage === i + 1 ? styles.activePageNumberPill : ""
                }`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            className={styles.pageArrowButton}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next &raquo;
          </button>
        </div>
      )}
    </div>
  );
}

export default SellerPendingProducts;