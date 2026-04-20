// src/pages/seller/SellerPendingProducts.js

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingProductsThunk } from "../../redux/slices/pendingProductsThunk";
import styles from "../../styles/Seller/SellerPendingProducts.module.css";

function SellerPendingProducts() {
  const dispatch = useDispatch();
  const [expandedCard, setExpandedCard] = useState(null);

  const {
    pendingProducts,
    pendingProductsLoading,
    pendingProductsError,
  } = useSelector((state) => state.sellerProduct);

  useEffect(() => {
    dispatch(fetchPendingProductsThunk());
  }, [dispatch]);

  const handleToggle = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const getStatusClass = (status) => {
    if (status === "approved") return styles.approved;
    if (status === "rejected") return styles.rejected;
    return styles.pending;
  };

  const getBadgeClass = (status) => {
    if (status === "approved") return styles.statusApproved;
    if (status === "rejected") return styles.statusRejected;
    return styles.statusPending;
  };

  const getStatusText = (status) => {
    if (status === "approved") return "Approved";
    if (status === "rejected") return "Rejected";
    return "Pending";
  };

  if (pendingProductsLoading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading products...</p>
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
      <h1 className={styles.heading}>Your Products</h1>

      {pendingProducts.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No products found</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {pendingProducts.map((product) => (
            <div className={styles.card} key={product._id}>
              <div className={styles.imageWrapper}>
                <div
                  className={`${styles.statusBadge} ${getBadgeClass(
                    product.status
                  )}`}
                >
                  {getStatusText(product.status)}
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
                  <span className={getStatusClass(product.status)}>
                    {product.status === "approved"
                      ? "Approved"
                      : product.status === "rejected"
                      ? "Rejected"
                      : "Pending Approval"}
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
                      <p className={styles.description}>
                        {product.description}
                      </p>
                    )}
                  </>
                )}

                <button
                  className={styles.viewMoreBtn}
                  onClick={() => handleToggle(product._id)}
                >
                  {expandedCard === product._id ? "View Less" : "View More"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SellerPendingProducts;