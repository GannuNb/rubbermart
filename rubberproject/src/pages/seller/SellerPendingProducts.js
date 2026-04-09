import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingProductsThunk } from "../../redux/slices/pendingProductsThunk";
import styles from "../../styles/SellerPendingProducts.module.css";

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
    if (expandedCard === id) {
      setExpandedCard(null);
    } else {
      setExpandedCard(id);
    }
  };

  if (pendingProductsLoading) {
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
                  <strong>Status:</strong> Pending Approval
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