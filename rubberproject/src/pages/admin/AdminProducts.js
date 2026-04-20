// src/pages/admin/AdminProducts.js

import React, { useEffect, useState } from "react";
import styles from "../../styles/Admin/AdminProducts.module.css";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchApprovedProducts = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/products/admin/approved-products`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.log("Fetch Approved Products Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedProducts();
  }, []);

  return (
    <div className={styles.adminProductsWrapper}>
      <div className={styles.adminProductsHeader}>
        <h1 className={styles.adminProductsTitle}>Approved Products</h1>
        <p className={styles.adminProductsSubtitle}>
          View and manage all approved seller products
        </p>
      </div>

      {loading ? (
        <div className={styles.adminProductsEmptyState}>
          Loading approved products...
        </div>
      ) : products.length === 0 ? (
        <div className={styles.adminProductsEmptyState}>
          No approved products found
        </div>
      ) : (
        <div className={styles.adminProductsGrid}>
          {products.map((product) => (
            <div key={product._id} className={styles.adminProductCard}>
              <div className={styles.adminProductImageWrapper}>
                {product.images?.length > 0 ? (
                  <img
                    src={product.images[0].image}
                    alt={product.category}
                    className={styles.adminProductImage}
                  />
                ) : (
                  <div className={styles.adminProductNoImage}>
                    No Image Available
                  </div>
                )}
              </div>

              <div className={styles.adminProductContent}>
                <div className={styles.adminProductTopRow}>
                  <h3 className={styles.adminProductCategory}>
                    {product.category}
                  </h3>

                  <span className={styles.adminProductApprovedBadge}>
                    Approved
                  </span>
                </div>

                <div className={styles.adminShortInfo}>
                  <p>
                    <strong>Quantity:</strong> {product.quantity} MT
                  </p>

                  <p>
                    <strong>Price:</strong> ₹{product.pricePerMT} / MT
                  </p>

                  <p>
                    <strong>Location:</strong> {product.loadingLocation}
                  </p>

                  <p>
                    <strong>Seller:</strong>{" "}
                    {product.seller?.fullName || "N/A"}
                  </p>
                </div>

                <div className={styles.adminProductBottomRow}>
                  <span
                    className={
                      product.stockStatus === "available"
                        ? styles.adminProductAvailable
                        : styles.adminProductSoldOut
                    }
                  >
                    {product.stockStatus}
                  </span>

                  <button
                    className={styles.adminViewMoreButton}
                    onClick={() => setSelectedProduct(product)}
                  >
                    View More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProduct && (
        <div
          className={styles.adminProductModalOverlay}
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className={styles.adminProductModal}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.adminModalCloseButton}
              onClick={() => setSelectedProduct(null)}
            >
              ×
            </button>

            <h2 className={styles.adminModalTitle}>
              {selectedProduct.category}
            </h2>

            {selectedProduct.images?.length > 0 && (
              <img
                src={selectedProduct.images[0].image}
                alt={selectedProduct.category}
                className={styles.adminModalImage}
              />
            )}

            <div className={styles.adminModalDetails}>
              <p>
                <strong>Application:</strong> {selectedProduct.application}
              </p>

              <p>
                <strong>Quantity:</strong> {selectedProduct.quantity} MT
              </p>

              <p>
                <strong>Loading Location:</strong>{" "}
                {selectedProduct.loadingLocation}
              </p>

              <p>
                <strong>Country of Origin:</strong>{" "}
                {selectedProduct.countryOfOrigin}
              </p>

              <p>
                <strong>Price Per MT:</strong> ₹
                {selectedProduct.pricePerMT}
              </p>

              <p>
                <strong>HSN Code:</strong> {selectedProduct.hsnCode}
              </p>

              <p>
                <strong>Seller Name:</strong>{" "}
                {selectedProduct.seller?.fullName || "N/A"}
              </p>

              <p>
                <strong>Seller Email:</strong>{" "}
                {selectedProduct.seller?.email || "N/A"}
              </p>

              <p>
                <strong>Status:</strong> {selectedProduct.status}
              </p>

              <p>
                <strong>Stock Status:</strong>{" "}
                {selectedProduct.stockStatus}
              </p>

              {selectedProduct.description && (
                <p>
                  <strong>Description:</strong>{" "}
                  {selectedProduct.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;