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

  const itemsPerPage = 5;

  const [currentPage, setCurrentPage] = useState(1);

  const {
    sellerOrders, // Expected structure: { orders: [], totalPages: N }
    sellerOrdersLoading,
    sellerOrdersError,
  } = useSelector((state) => state.sellerOrders);

  const orders = sellerOrders?.orders || [];
  const totalPages = sellerOrders?.totalPages || 1;

  useEffect(() => {
    dispatch(getSellerOrdersThunk(currentPage));
  }, [dispatch, currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (sellerOrdersLoading) {
    return <div className={styles.loading}>Loading orders...</div>;
  }

  if (sellerOrdersError) {
    return <div className={styles.error}>{sellerOrdersError}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Seller Orders</h1>

      {orders.length === 0 ? (
        <div className={styles.empty}>No orders found</div>
      ) : (
        <>
          <div className={styles.ordersGrid}>
            {orders.map((order) => {
              const item = order.orderItems?.[0];
              const productImage =
                item?.productImage?.data?.data && item?.productImage?.contentType
                  ? `data:${item.productImage.contentType};base64,${btoa(
                    new Uint8Array(item.productImage.data.data).reduce(
                      (data, byte) => data + String.fromCharCode(byte),
                      ""
                    )
                  )}`
                  : null;

              return (
                <div key={order._id} className={styles.orderCard}>
                  <div className={styles.imageContainer}>
                    {productImage ? (
                      <img src={productImage} alt={item?.productName || "Product"} className={styles.productImage} />
                    ) : (
                      <div className={styles.imageFallback}><Package size={32} /></div>
                    )}
                    {order.orderItems?.length > 1 && (
                      <span className={styles.itemBadge}>+{order.orderItems.length - 1} More</span>
                    )}
                  </div>

                  <div className={styles.row}><span>Order ID:</span> <strong>{order.orderId}</strong></div>
                  <div className={styles.row}><span>Buyer:</span> <strong>{order.buyer?.fullName}</strong></div>
                  <div className={styles.row}><span>Email:</span> <strong>{order.buyer?.email}</strong></div>
                  <div className={styles.row}><span>Total Products:</span> <strong>{order.orderItems?.length || 0}</strong></div>
                  <div className={styles.row}><span>Total Amount:</span> <strong>₹ {order.totalAmount}</strong></div>
                  <div className={styles.row}><span>Status:</span> <strong className={styles.status}>{order.orderStatus}</strong></div>
                  <div className={styles.row}><span>Created:</span> <strong>{new Date(order.createdAt).toLocaleDateString()}</strong></div>

                  <button className={styles.viewButton} onClick={() => navigate(`/seller/order-manage/${order._id}`)}>
                    View Details
                  </button>
                </div>
              );
            })}
          </div>

          {/* DYNAMIC SLIDING PAGINATION FOOTER */}
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
                // 1. Calculate the range
                // Always show 3 pages if possible, sliding based on current page
                let startPage = Math.max(1, currentPage - 1);
                let endPage = Math.min(totalPages, startPage + 2);

                // Adjust if we are at the very beginning
                if (currentPage <= 2) {
                  startPage = 1;
                  endPage = Math.min(totalPages, 3);
                }

                // Adjust if we are at the very end
                if (currentPage >= totalPages - 1 && totalPages > 2) {
                  startPage = Math.max(1, totalPages - 2);
                  endPage = totalPages;
                }

                const pageNumbers = [];
                for (let i = startPage; i <= endPage; i++) {
                  pageNumbers.push(
                    <button
                      key={i}
                      className={`${styles.pageNumberPill} ${currentPage === i ? styles.activePageNumberPill : ""}`}
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