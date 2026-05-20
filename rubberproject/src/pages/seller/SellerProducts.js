import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingProductsThunk } from "../../redux/slices/pendingProductsThunk";
import styles from "../../styles/Seller/SellerPendingProducts.module.css";

function SellerProducts() {
  const dispatch = useDispatch();

  const [expandedCard, setExpandedCard] = useState(null);

  // PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const {
    pendingProducts,
    pendingProductsLoading,
    pendingProductsError,
  } = useSelector((state) => state.sellerProduct);

  useEffect(() => {
    dispatch(fetchPendingProductsThunk());
  }, [dispatch]);

  // UNFILTERED: Shows everything inside pendingProducts array (approved, rejected, pending)
  const totalPages = Math.ceil(pendingProducts.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAllProducts = pendingProducts.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggle = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  if (pendingProductsLoading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading total products...</p>
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
      <h1 className={styles.heading}>Your Total Products</h1>

      {pendingProducts.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No products found</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {currentAllProducts.map((product) => (
            <div className={styles.card} key={product._id}>
              <div className={styles.imageWrapper}>
                <div
                  className={`${styles.statusBadge} ${
                    product.status === "approved"
                      ? styles.statusApproved
                      : product.status === "rejected"
                        ? styles.statusRejected
                        : styles.statusPending
                  }`}
                >
                  {product.status === "approved"
                    ? "Approved"
                    : product.status === "rejected"
                      ? "Rejected"
                      : "Pending"}
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

                <p>
                  <strong>Category:</strong> {product.category}
                </p>

                <p>
                  <strong>Loading Location:</strong> {product.loadingLocation}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={
                      product.status === "approved"
                        ? styles.approved
                        : product.status === "rejected"
                          ? styles.rejected
                          : styles.pending
                    }
                  >
                    {product.status === "approved"
                      ? "Approved"
                      : product.status === "rejected"
                        ? "Rejected"
                        : "Pending Approval"}
                  </span>
                </p>

                <p>
                  <strong>Stock:</strong>{" "}
                  <span
                    className={
                      product.stockStatus === "soldout"
                        ? styles.rejected
                        : styles.approved
                    }
                  >
                    {product.stockStatus === "soldout" ? "Sold Out" : "Available"}
                  </span>
                </p>

                {expandedCard === product._id && (
                  <>
                    <p>
                      <strong>Quantity:</strong> {product.quantity} MT
                    </p>

                    <p>
                      <strong>Country:</strong> {product.countryOfOrigin}
                    </p>

                    <p>
                      <strong>Price Per MT:</strong> ₹{product.pricePerMT}
                    </p>

                    <p>
                      <strong>HSN Code:</strong> {product.hsnCode}
                    </p>

                    {product.description && (
                      <p className={styles.description}>{product.description}</p>
                    )}
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

      {/* PERSISTENT PAGINATION FOOTER */}
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
            let startPage = currentPage;
            if (currentPage === totalPages && totalPages > 1) {
              startPage = currentPage - 1;
            }

            const pageNumbers = [];
            const endPage = Math.min(totalPages, startPage + 1);

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
    </div>
  );
}

export default SellerProducts;