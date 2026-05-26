// src/components/admin/AdminPendingProducts.js

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminPendingProductsThunk,
  approveProductThunk,
  rejectProductThunk,
} from "../../redux/slices/adminProductThunk";
import CustomAlert from "../../components/alert/CustomAlert";
import styles from "../../styles/Admin/AdminPendingProducts.module.css";

function AdminPendingProducts() {
  const dispatch = useDispatch();
const [alert, setAlert] = useState(null);
const showAlert = (type, title, message) => {
  setAlert({ type, title, message });

  setTimeout(() => {
    setAlert(null);
  }, 3000);
};
  const {
    adminPendingProducts,
    adminPendingProductsTotalPages,
    adminPendingProductsLoading,
    adminPendingProductsError,
    approveProductLoading,
    approveProductLoadingId,
    rejectProductLoading,
    rejectProductLoadingId,
  } = useSelector((state) => state.sellerProduct);

  // PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(
      fetchAdminPendingProductsThunk(currentPage)
    );
  }, [dispatch, currentPage]);

  // Reset pagination window when items get removed
 useEffect(() => {
  if (
    currentPage > adminPendingProductsTotalPages &&
    adminPendingProductsTotalPages > 0
  ) {
    setCurrentPage(adminPendingProductsTotalPages);
  }
}, [adminPendingProductsTotalPages, currentPage]);

const handleApprove = async (productId) => {
  try {
    await dispatch(approveProductThunk(productId));
    showAlert("success", "Approved", "Product approved successfully");
  } catch (err) {
    showAlert("error", "Approval Failed", "Something went wrong");
  }
};

const handleReject = async (productId) => {
  try {
    await dispatch(rejectProductThunk(productId));
    showAlert("warning", "Rejected", "Product has been rejected");
  } catch (err) {
    showAlert("error", "Rejection Failed", "Something went wrong");
  }
};

  if (adminPendingProductsLoading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading pending products...</p>
      </div>
    );
  }

  if (adminPendingProductsError) {
    return (
      <div className={styles.loadingContainer}>
        <p>{adminPendingProductsError}</p>
      </div>
    );
  }

  // PAGINATION CHUNK ENGINE CALCULATION
  const currentProducts = adminPendingProducts;
  const totalPages = adminPendingProductsTotalPages;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.container}>
      {alert && (
  <CustomAlert
    type={alert.type}
    title={alert.title}
    message={alert.message}
    onClose={() => setAlert(null)}
  />
)}
      <div className={styles.header}>
        <h1>Approve Products</h1>
        <p>Review seller submitted products and approve or reject them.</p>
      </div>

      {adminPendingProducts.length === 0 ? (
        <div className={styles.emptyState}>
          <h2>No Pending Products</h2>
          <p>All seller products have already been reviewed.</p>
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {currentProducts.map((product) => (
              <div className={styles.card} key={product._id}>
                <div className={styles.imageWrapper}>
                  {product.images?.length > 0 ? (
                    <img
                      src={product.images[0].image}
                      alt={product.application}
                      className={styles.image}
                    />
                  ) : (
                    <div className={styles.noImage}>No Image</div>
                  )}
                </div>

                <div className={styles.content}>
                  <div className={styles.topSection}>
                    <h2>{product.application}</h2>
                    <span className={styles.pendingBadge}>Pending</span>
                  </div>

                  <div className={styles.infoGrid}>
                    <div>
                      <span>Category</span>
                      <p>{product.category}</p>
                    </div>
                    <div>
                      <span>Quantity</span>
                      <p>{product.quantity} MT</p>
                    </div>
                    <div>
                      <span>Location</span>
                      <p>{product.loadingLocation}</p>
                    </div>
                    <div>
                      <span>Country</span>
                      <p>{product.countryOfOrigin}</p>
                    </div>
                    <div>
                      <span>Price</span>
                      <p>₹{product.pricePerMT}</p>
                    </div>
                    <div>
                      <span>HSN Code</span>
                      <p>{product.hsnCode}</p>
                    </div>
                  </div>

                  <div className={styles.sellerInfo}>
                    <h3>Seller Information</h3>
                    <p>
                      <strong>Name:</strong> {product.seller?.fullName}
                    </p>
                    <p>
                      <strong>Email:</strong> {product.seller?.email}
                    </p>
                  </div>

                  {product.description && (
                    <div className={styles.description}>
                      <h3>Description</h3>
                      <p>{product.description}</p>
                    </div>
                  )}

                  <div className={styles.buttonGroup}>
                    <button
                      className={styles.approveBtn}
                      onClick={() => handleApprove(product._id)}
                      disabled={
                        approveProductLoading &&
                        approveProductLoadingId === product._id
                      }
                    >
                      {approveProductLoading &&
                        approveProductLoadingId === product._id
                        ? "Approving..."
                        : "Approve"}
                    </button>

                    <button
                      className={styles.rejectBtn}
                      onClick={() => handleReject(product._id)}
                      disabled={
                        rejectProductLoading &&
                        rejectProductLoadingId === product._id
                      }
                    >
                      {rejectProductLoading &&
                        rejectProductLoadingId === product._id
                        ? "Rejecting..."
                        : "Reject"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* UPDATED PAGINATION CONTROL - VISIBLE EVEN FOR 1 PAGE */}
          {adminPendingProducts.length > 0 && (
            <div className={styles.paginationWrapper}>
              <button
                className={styles.pageArrowButton}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &laquo; Previous
              </button>

              <div className={styles.pageNumbersGrid}>
                {Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    className={`${styles.pageNumberPill} ${currentPage === pageNumber ? styles.activePageNumberPill : ""
                      }`}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
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
        </>
      )}
    </div>
  );
}

export default AdminPendingProducts;