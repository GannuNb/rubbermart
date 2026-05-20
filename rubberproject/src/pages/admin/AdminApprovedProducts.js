// src/components/admin/AdminApprovedProducts.js

import React, { useEffect, useState } from "react";
import styles from "../../styles/Admin/AdminProducts.module.css";

function AdminApprovedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Matching structural inventory limit configurations

  const fetchApprovedProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const baseUrl = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/\/$/, "") : "";
      
      const response = await fetch(
        `${baseUrl}/api/products/admin/approved-products`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
        setCurrentPage(1); // Safely reset page viewport context back to page 1 on content reload
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

  // PAGINATION CHUNK ENGINE CALCULATION
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Move client viewport upper frame gracefully
  };

  return (
    <div className={styles.adminProductsWrapper}>
      <div className={styles.adminProductsHeader}>
        <h1 className={styles.adminProductsTitle}>Approved Products</h1>
        <p className={styles.adminProductsSubtitle}>
          View and manage all approved seller products
        </p>
      </div>

      {loading ? (
        <div className={styles.adminProductsEmptyState}>Loading approved products...</div>
      ) : products.length === 0 ? (
        <div className={styles.adminProductsEmptyState}>No approved products found</div>
      ) : (
        <>
          <div className={styles.adminProductsGrid}>
            {currentProducts.map((product) => (
              <div key={product._id} className={styles.adminProductCard}>
                <div className={styles.adminProductImageWrapper}>
                  {product.images?.length > 0 ? (
                    <img src={product.images[0].image} alt={product.category} className={styles.adminProductImage} />
                  ) : (
                    <div className={styles.adminProductNoImage}>No Image Available</div>
                  )}
                </div>
                <div className={styles.adminProductContent}>
                  <div className={styles.adminProductTopRow}>
                    <h3 className={styles.adminProductCategory}>{product.category}</h3>
                    <span className={styles.adminProductApprovedBadge}>Approved</span>
                  </div>
                  <div className={styles.adminShortInfo}>
                    <p><strong>Quantity:</strong> {product.quantity} MT</p>
                    <p><strong>Price:</strong> ₹{product.pricePerMT} / MT</p>
                    <p><strong>Location:</strong> {product.loadingLocation}</p>
                    <p><strong>Seller:</strong> {product.seller?.fullName || "N/A"}</p>
                  </div>
                  <div className={styles.adminProductBottomRow}>
                    <span className={product.stockStatus === "available" ? styles.adminProductAvailable : styles.adminProductSoldOut}>
                      {product.stockStatus}
                    </span>
                    <button className={styles.adminViewMoreButton} onClick={() => setSelectedProduct(product)}>
                      View More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION CONTROL FOOTER UI INTERFACE - PERMANENTLY VISIBLE WHEN RECORDS EXIST */}
          {products.length > 0 && (
            <div className={styles.paginationWrapper}>
              <button 
                className={styles.pageArrowButton}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &laquo; Previous
              </button>
              
              <div className={styles.pageNumbersGrid}>
                {Array.from({ length: totalPages || 1 }, (_, index) => {
                  const pageNum = index + 1;
                  return (
                    <button
                      key={pageNum}
                      className={`${styles.pageNumberPill} ${currentPage === pageNum ? styles.activePageNumberPill : ""}`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button 
                className={styles.pageArrowButton}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages <= 1}
              >
                Next &raquo;
              </button>
            </div>
          )}
        </>
      )}

      {/* VIEW DETAILS MODAL */}
      {selectedProduct && (
        <div className={styles.adminProductModalOverlay} onClick={() => setSelectedProduct(null)}>
          <div className={styles.adminProductModal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.adminModalCloseButton} onClick={() => setSelectedProduct(null)}>×</button>
            <h2 className={styles.adminModalTitle}>{selectedProduct.category}</h2>
            {selectedProduct.images?.length > 0 ? (
              <img src={selectedProduct.images[0].image} alt={selectedProduct.category} className={styles.adminModalImage} />
            ) : (
              <div className={styles.adminProductNoImage} style={{ height: "200px", marginBottom: "15px" }}>No Image Available</div>
            )}
            <div className={styles.adminModalDetails}>
              <p><strong>Application:</strong> {selectedProduct.application}</p>
              <p><strong>Quantity:</strong> {selectedProduct.quantity} MT</p>
              <p><strong>Loading Location:</strong> {selectedProduct.loadingLocation}</p>
              <p><strong>Country of Origin:</strong> {selectedProduct.countryOfOrigin}</p>
              <p><strong>Price Per MT:</strong> ₹{selectedProduct.pricePerMT}</p>
              <p><strong>HSN Code:</strong> {selectedProduct.hsnCode}</p>
              <p><strong>Seller Name:</strong> {selectedProduct.seller?.fullName || "N/A"}</p>
              <p><strong>Seller Email:</strong> {selectedProduct.seller?.email || "N/A"}</p>
              <p><strong>Status:</strong> {selectedProduct.status}</p>
              <p><strong>Stock Status:</strong> {selectedProduct.stockStatus}</p>
              {selectedProduct.description && <p><strong>Description:</strong> {selectedProduct.description}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminApprovedProducts;