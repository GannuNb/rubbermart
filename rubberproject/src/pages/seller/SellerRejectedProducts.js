import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingProductsThunk } from "../../redux/slices/pendingProductsThunk";
import styles from "../../styles/Seller/SellerPendingProducts.module.css";

function SellerRejectedProducts() {
  const dispatch = useDispatch();
  const [expandedCard, setExpandedCard] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Correctly target the rejectedProducts bucket
  const { 
    items: rejectedProducts, 
    totalPages 
  } = useSelector((state) => state.sellerProduct.rejectedProducts);

  // 2. Select the global loading/error states
  const { 
    pendingProductsLoading, 
    pendingProductsError 
  } = useSelector((state) => state.sellerProduct);

  // Fetch data dynamically whenever the current page changes
  useEffect(() => {
    dispatch(fetchPendingProductsThunk(currentPage, "rejected"));
  }, [dispatch, currentPage]);

  const handleToggle = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= (totalPages || 1)) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (pendingProductsLoading && rejectedProducts.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading rejected products...</p>
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
      <h1 className={styles.heading}>Rejected Products</h1>

      {!rejectedProducts || rejectedProducts.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No rejected products found</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {rejectedProducts.map((product) => (
            <div className={styles.card} key={product._id}>
              <div className={styles.imageWrapper}>
                <div className={`${styles.statusBadge} ${styles.statusRejected}`}>
                  Rejected
                </div>

                {product.images && product.images.length > 0 ? (
                  <img
                    src={(() => {
                      const imgObj = product.images[0];
                      if (typeof imgObj === "string") return imgObj;
                      if (typeof imgObj.image === "string") return imgObj.image;
                      
                      // Handling potential Buffer data
                      if (imgObj.data && imgObj.data.data) {
                        const base64String = btoa(
                          String.fromCharCode(...new Uint8Array(imgObj.data.data))
                        );
                        return `data:${imgObj.contentType};base64,${base64String}`;
                      }
                      return "";
                    })()}
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
                <p><strong>Status:</strong> <span className={styles.rejected}>Rejected</span></p>

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
            const pageNumbers = [];
            const maxPagesToShow = 3;
            let startPage = Math.max(1, currentPage - 1);
            let endPage = Math.min(totalPages || 1, startPage + maxPagesToShow - 1);

            if (endPage - startPage < maxPagesToShow - 1) {
              startPage = Math.max(1, endPage - maxPagesToShow + 1);
            }

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
          disabled={currentPage === (totalPages || 1)}
        >
          Next &raquo;
        </button>
      </div>
    </div>
  );
}

export default SellerRejectedProducts;