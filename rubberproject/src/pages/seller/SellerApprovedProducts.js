import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingProductsThunk } from "../../redux/slices/pendingProductsThunk";
import { updateSellerProductThunk } from "../../redux/slices/sellerProductThunk";
import CustomAlert from "../../components/alert/CustomAlert";
import styles from "../../styles/Seller/SellerPendingProducts.module.css";

function SellerApprovedProducts() {
  const dispatch = useDispatch();
  const [expandedCard, setExpandedCard] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);

  // Pagination parameters state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const [alert, setAlert] = useState({
    show: false,
    type: "",
    title: "",
    message: "",
  });

  const [editForm, setEditForm] = useState({
    quantity: "",
    pricePerMT: "",
    description: "",
    loadingLocation: "",
    stockStatus: "available",
  });

  const {
    pendingProducts,
    pendingProductsLoading,
    pendingProductsError,
    approveProductLoading,
  } = useSelector((state) => state.sellerProduct);

  useEffect(() => {
    dispatch(fetchPendingProductsThunk());
  }, [dispatch]);

  // FILTERED: Only keep items whose status is explicitly approved
  const approvedProducts = pendingProducts.filter(
    (product) => product.status === "approved"
  );

  const handleToggle = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  // Pagination metrics tied strictly to filtered approved collection
  const totalPages = Math.ceil(approvedProducts.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = approvedProducts.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditClick = (product) => {
    setEditingProductId(
      editingProductId === product._id ? null : product._id
    );

    setEditForm({
      quantity: product.quantity,
      pricePerMT: product.pricePerMT,
      description: product.description || "",
      loadingLocation: product.loadingLocation,
      stockStatus: product.stockStatus || "available",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProduct = async (productId) => {
    try {
      await dispatch(updateSellerProductThunk(productId, editForm));

      setAlert({
        show: true,
        type: "success",
        title: "Product Updated",
        message: "Your approved product has been updated successfully.",
      });

      dispatch(fetchPendingProductsThunk());
      setEditingProductId(null);
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        title: "Update Failed",
        message: "Failed to update product.",
      });
    }
  };

  if (pendingProductsLoading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading approved products...</p>
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
      {alert.show && (
        <CustomAlert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() =>
            setAlert({ show: false, type: "", title: "", message: "" })
          }
        />
      )}

      <h1 className={styles.heading}>Approved Products</h1>

      {approvedProducts.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No approved products found</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {currentProducts.map((product) => (
            <div className={styles.card} key={product._id}>
              <div className={styles.imageWrapper}>
                <div className={`${styles.statusBadge} ${styles.statusApproved}`}>
                  Approved
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
                  <span className={styles.approved}>Approved</span>
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

                <button
                  className={styles.viewMoreBtn}
                  onClick={() => handleEditClick(product)}
                >
                  {editingProductId === product._id ? "Cancel Edit" : "Edit Product"}
                </button>

                {editingProductId === product._id && (
                  <div className={styles.editSection}>
                    <input
                      type="number"
                      name="quantity"
                      placeholder="Quantity"
                      value={editForm.quantity}
                      onChange={handleEditChange}
                      className={styles.editInput}
                    />

                    <input
                      type="number"
                      name="pricePerMT"
                      placeholder="Price Per MT"
                      value={editForm.pricePerMT}
                      onChange={handleEditChange}
                      className={styles.editInput}
                    />

                    <select
                      name="loadingLocation"
                      value={editForm.loadingLocation}
                      onChange={handleEditChange}
                      className={styles.editInput}
                    >
                      <option value="Ex Chennai">Ex Chennai</option>
                      <option value="Ex Mundra">Ex Mundra</option>
                      <option value="Ex Nhavasheva">Ex Nhavasheva</option>
                    </select>

                    <select
                      name="stockStatus"
                      value={editForm.stockStatus}
                      onChange={handleEditChange}
                      className={styles.editInput}
                    >
                      <option value="available">Available</option>
                      <option value="soldout">Sold Out</option>
                    </select>

                    <textarea
                      name="description"
                      placeholder="Description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      className={styles.editTextarea}
                    />

                    <button
                      className={styles.saveBtn}
                      onClick={() => handleUpdateProduct(product._id)}
                      disabled={approveProductLoading}
                    >
                      {approveProductLoading ? "Updating..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PERSISTENT 2-PILL MAX PAGINATION FOOTER */}
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

export default SellerApprovedProducts;