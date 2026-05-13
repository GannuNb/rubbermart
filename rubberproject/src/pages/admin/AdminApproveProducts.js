import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  fetchAdminPendingProductsThunk,
  approveProductThunk,
  rejectProductThunk,
} from "../../redux/slices/adminProductThunk";

import styles from "../../styles/Admin/AdminApproveProducts.module.css";

function AdminApproveProducts() {
  const dispatch = useDispatch();

  const {
    adminPendingProducts,
    adminPendingProductsLoading,
    adminPendingProductsError,

    approveProductLoading,
    approveProductLoadingId,

    rejectProductLoading,
    rejectProductLoadingId,
  } = useSelector((state) => state.sellerProduct);

  useEffect(() => {
    dispatch(fetchAdminPendingProductsThunk());
  }, [dispatch]);

  const handleApprove = (productId) => {
    dispatch(approveProductThunk(productId));
  };

  const handleReject = (productId) => {
    dispatch(rejectProductThunk(productId));
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

  return (
    <div className={styles.container}>
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
        <div className={styles.grid}>
          {adminPendingProducts.map((product) => (
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
      )}
    </div>
  );
}

export default AdminApproveProducts;
