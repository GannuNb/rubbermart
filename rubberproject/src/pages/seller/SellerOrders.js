// src/pages/seller/SellerOrders.js

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSellerOrdersThunk } from "../../redux/slices/sellerOrderThunk";
import { Package } from "lucide-react"; 
import styles from "../../styles/Seller/SellerOrders.module.css";

const SellerOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // PAGINATION ENGINE STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const {
    sellerOrders,
    sellerOrdersLoading,
    sellerOrdersError,
  } = useSelector((state) => state.sellerOrders);

  useEffect(() => {
    dispatch(getSellerOrdersThunk());
  }, [dispatch]);

  if (sellerOrdersLoading) {
    return <div className={styles.loading}>Loading orders...</div>;
  }

  if (sellerOrdersError) {
    return <div className={styles.error}>{sellerOrdersError}</div>;
  }

  // PAGINATION MATHEMATICS ENGINE
  // Ensures totalPages defaults to at least 1 so pagination controls are always built
  const totalPages = Math.ceil(sellerOrders.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = sellerOrders.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Seller Orders</h1>

      {sellerOrders.length === 0 ? (
        <>
          <div className={styles.empty}>No orders found</div>
          
          {/* ALWAYS VISIBLE PAGINATION BLOCK FOR EMPTY STATE */}
          <div className={styles.paginationWrapper}>
            <button 
              className={styles.pageArrowButton}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &laquo; Previous
            </button>
            <div className={styles.pageNumbersGrid}>
              <button className={`${styles.pageNumberPill} ${styles.activePageNumberPill}`}>
                1
              </button>
            </div>
            <button 
              className={styles.pageArrowButton}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next &raquo;
            </button>
          </div>
        </>
      ) : (
        <>
          <div className={styles.ordersGrid}>
            {currentOrders.map((order) => {
              // --- BACKEND PROTECTED ITEM TARGETING ---
              const item = order.orderItems?.[0];

              /* ===================================================
                 EXACT BINARY TO BASE64 IMAGE CONVERSION 
                 =================================================== */
              const productImage =
                item?.productImage?.data?.data && item?.productImage?.contentType
                  ? `data:${item.productImage.contentType};base64,${btoa(
                      new Uint8Array(item.productImage.data.data).reduce(
                        (data, byte) => data + String.fromCharCode(byte),
                        "",
                      ),
                    )}`
                  : null;

              return (
                <div key={order._id} className={styles.orderCard}>
                  
                  {/* DYNAMIC CARD IMAGE WRAPPER */}
                  <div className={styles.imageContainer}>
                    {productImage ? (
                      <img
                        src={productImage}
                        alt={item?.productName || "Ordered Product"}
                        className={styles.productImage}
                      />
                    ) : (
                      <div className={styles.imageFallback}>
                        <Package size={32} />
                      </div>
                    )}
                    
                    {/* MULTI-ITEM ARRAY COUNTER */}
                    {order.orderItems?.length > 1 && (
                      <span className={styles.itemBadge}>
                        +{order.orderItems.length - 1} More Items
                      </span>
                    )}
                  </div>

                  {/* UNTOUCHED BACKEND CORES */}
                  <div className={styles.row}>
                    <span>Order ID:</span>
                    <strong>{order.orderId}</strong>
                  </div>

                  <div className={styles.row}>
                    <span>Buyer:</span>
                    <strong>{order.buyer?.fullName}</strong>
                  </div>

                  <div className={styles.row}>
                    <span>Email:</span>
                    <strong>{order.buyer?.email}</strong>
                  </div>

                  <div className={styles.row}>
                    <span>Total Products:</span>
                    <strong>{order.orderItems?.length}</strong>
                  </div>

                  <div className={styles.row}>
                    <span>Total Amount:</span>
                    <strong>₹ {order.totalAmount}</strong>
                  </div>

                  <div className={styles.row}>
                    <span>Status:</span>
                    <strong className={styles.status}>
                      {order.orderStatus}
                    </strong>
                  </div>

                  <div className={styles.row}>
                    <span>Created:</span>
                    <strong>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </strong>
                  </div>

                  <button
                    className={styles.viewButton}
                    onClick={() =>
                      navigate(`/seller/order-manage/${order._id}`)
                    }
                  >
                    View Details
                  </button>
                </div>
              );
            })}
          </div>

          {/* ALWAYS VISIBLE PAGINATION CONTROL FOOTER */}
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
                // Determine start page based on current selection window
                let startPage = Math.max(1, currentPage);
                
                // If we are at the very last page, shift backwards to still show 2 pills if possible
                if (currentPage === totalPages && totalPages > 1) {
                  startPage = Math.max(1, currentPage - 1);
                }
              
                // Calculate the final boundary to show exactly 2 items maximum
                const endPage = Math.min(totalPages, startPage + 1);
              
                const pageNumbers = [];
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
        </>
      )}
    </div>
  );
};

export default SellerOrders;