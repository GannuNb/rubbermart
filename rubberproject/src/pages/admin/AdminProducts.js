import React, { useEffect, useState } from "react";
import styles from "../../styles/Admin/AdminProducts.module.css";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 3; 

  const fetchAllProducts = async (page) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const baseUrl = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/\/$/, "") : "";

      const response = await fetch(`${baseUrl}/api/products/admin/all-products?page=${page}&limit=${itemsPerPage}`, { headers });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.products) {
          setProducts(data.products);
          setTotalPages(data.totalPages);
        }
      }
    } catch (error) {
      console.error("Compilation process tracking failure:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts(currentPage);
  }, [currentPage]);

  const getStatusBadgeStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return { backgroundColor: "#ecfdf3", color: "#027a48", border: "1px solid #d1fadf" };
      case "rejected":
        return { backgroundColor: "#fff1f2", color: "#b91c1c", border: "1px solid #fee2e2" };
      case "pending":
      default:
        return { backgroundColor: "#fff7ed", color: "#c2410c", border: "1px solid #ffedd5" };
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.adminProductsWrapper}>
      <div className={styles.adminProductsHeader}>
        <h1 className={styles.adminProductsTitle}>Total Products</h1>
        <p className={styles.adminProductsSubtitle}>
          View comprehensive inventory across approved, pending, and rejected statuses
        </p>
      </div>

      {loading ? (
        <div className={styles.adminProductsEmptyState}>Loading total products inventory...</div>
      ) : products.length === 0 ? (
        <div className={styles.adminProductsEmptyState}>No products found inside inventory records</div>
      ) : (
        <>
          <div className={styles.adminProductsGrid}>
            {products.map((product) => (
              <div key={product._id} className={styles.adminProductCard}>
                <div className={styles.adminProductImageWrapper}>
                  {product.images?.length > 0 && product.images[0].image ? (
                    <img src={product.images[0].image} alt={product.category} className={styles.adminProductImage} />
                  ) : (
                    <div className={styles.adminProductNoImage}>No Image Available</div>
                  )}
                </div>
                <div className={styles.adminProductContent}>
                  <div className={styles.adminProductTopRow}>
                    <h3 className={styles.adminProductCategory}>{product.category}</h3>
                    <span className={styles.adminProductStatusBadge} style={getStatusBadgeStyle(product.status)}>
                      {product.status ? product.status.charAt(0).toUpperCase() + product.status.slice(1) : "Pending"}
                    </span>
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

          {totalPages > 1 && (
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
                  let pages = [];
                  // Logic: Show up to 3 buttons centered on current page
                  let start = Math.max(1, currentPage - 1);
                  let end = Math.min(totalPages, start + 2);
                  
                  // Adjust if we are at the end of the list
                  if (end - start < 2 && totalPages > 2) {
                    start = Math.max(1, totalPages - 2);
                  }

                  for (let i = start; i <= end; i++) {
                    pages.push(
                      <button
                        key={i}
                        className={`${styles.pageNumberPill} ${currentPage === i ? styles.activePageNumberPill : ""}`}
                        onClick={() => handlePageChange(i)}
                      >
                        {i}
                      </button>
                    );
                  }
                  return pages;
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
          )}
        </>
      )}

      {/* VIEW DETAILS MODAL - FULLY RESTORED */}
      {selectedProduct && (
        <div className={styles.adminProductModalOverlay} onClick={() => setSelectedProduct(null)}>
          <div className={styles.adminProductModal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.adminModalCloseButton} onClick={() => setSelectedProduct(null)}>×</button>
            <h2 className={styles.adminModalTitle}>{selectedProduct.category}</h2>

            {selectedProduct.images?.length > 0 && selectedProduct.images[0].image ? (
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
              <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <strong>Status:</strong>
                <span className={styles.adminProductStatusBadge} style={getStatusBadgeStyle(selectedProduct.status)}>
                  {selectedProduct.status ? selectedProduct.status.toUpperCase() : "PENDING"}
                </span>
              </p>
              <p><strong>Stock Status:</strong> {selectedProduct.stockStatus}</p>
              {selectedProduct.description && <p><strong>Description:</strong> {selectedProduct.description}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;