// src/pages/buyer/BuyerOrders.js

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import styles from "../../styles/Buyer/BuyerOrders.module.css";

import OrderCard from "../../components/orders/OrderCard";
import OrderFilters from "../../components/orders/OrderFilters";
import OrderHeader from "../../components/orders/OrderHeader";

import { getBuyerOrdersThunk } from "../../redux/slices/getBuyerOrdersThunk";
import { getDisplayStatus } from "../../utils/orderStatusHelpers";

function BuyerOrders() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeFilter, setActiveFilter] = useState("all");

  // PAGINATION CONTROLLER STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const { orders, ordersLoading, ordersError } = useSelector(
    (state) => state.buyerOrders,
  );

  /* =========================
     FETCH BUYER ORDERS
  ========================= */

  useEffect(() => {
    dispatch(getBuyerOrdersThunk());
  }, [dispatch]);

  // Reset pagination position to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  /* =========================
     FILTER LOGIC
  ========================= */

  const filteredOrders = useMemo(() => {
    if (activeFilter === "all") return orders;

    return orders.filter((order) => {
      const displayStatus = getDisplayStatus(order);

      if (activeFilter === "in_progress") {
        return displayStatus !== "Delivered" && displayStatus !== "Cancelled";
      }

      if (activeFilter === "partial_shipments") {
        return displayStatus === "Partial Shipment";
      }

      if (activeFilter === "shipped") {
        return displayStatus === "Shipped";
      }

      if (activeFilter === "delivered") {
        return displayStatus === "Delivered";
      }

      if (activeFilter === "cancelled") {
        return displayStatus === "Cancelled";
      }

      return true;
    });
  }, [orders, activeFilter]);

  /* =========================
     CORE CHUNKING ENGINE METRICS
  ========================= */
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* =========================
     LOADING
  ========================= */

  if (ordersLoading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.loadingText}>Loading orders...</div>
      </div>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (ordersError) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.loadingText}>{ordersError}</div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      {/* HEADER */}
      <OrderHeader />

      {/* CONTENT */}
      <div className={styles.contentCard}>
        {/* FILTERS */}
        <OrderFilters
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        {/* LIST */}
        {filteredOrders.length === 0 ? (
          <div className={styles.emptyState}>
            <h2>No Orders Found</h2>
            <p>No orders available for this filter.</p>
          </div>
        ) : (
          <div className={styles.ordersList}>
            {currentOrders.map((order) => (
              <OrderCard key={order._id} order={order} navigate={navigate} />
            ))}
          </div>
        )}

        {/* PERSISTENT PAGINATION FOOTER */}
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
      </div>
    </div>
  );
}

export default BuyerOrders;