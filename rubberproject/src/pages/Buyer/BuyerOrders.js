import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import styles from "../../styles/Buyer/BuyerOrders.module.css";

import OrderCard from "../../components/orders/OrderCard";

import OrderFilters from "../../components/orders/OrderFilters";

import OrderHeader from "../../components/orders/OrderHeader";

import { getBuyerOrdersThunk } from "../../redux/slices/getBuyerOrdersThunk";

function BuyerOrders() {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  /* =========================
     FILTER + PAGINATION
  ========================= */

  const [activeFilter, setActiveFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);

  /* =========================
     REDUX
  ========================= */

  const { orders, ordersLoading, ordersError, pagination } = useSelector(
    (state) => state.buyerOrders,
  );

  /* =========================
     FETCH ORDERS
  ========================= */

  useEffect(() => {
    dispatch(
      getBuyerOrdersThunk({
        page: currentPage,

        limit: 3,

        filter: activeFilter,
      }),
    );
  }, [dispatch, currentPage, activeFilter]);

  /* =========================
     FILTER CHANGE
  ========================= */

  const handleFilterChange = (filterValue) => {
    setActiveFilter(filterValue);

    setCurrentPage(1);
  };

  /* =========================
     PAGE CHANGE
  ========================= */

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > pagination.totalPages) {
      return;
    }

    setCurrentPage(pageNumber);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
          setActiveFilter={handleFilterChange}
        />

        {/* LIST */}

        {orders.length === 0 ? (
          <div className={styles.emptyState}>
            <h2>No Orders Found</h2>

            <p>No orders available for this filter.</p>
          </div>
        ) : (
          <div className={styles.ordersList}>
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} navigate={navigate} />
            ))}
          </div>
        )}

        {/* PAGINATION */}

        {pagination.totalPages > 1 && (
          <div className={styles.paginationWrapper}>
            {/* PREVIOUS */}

            <button
              className={styles.pageArrowButton}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &laquo; Previous
            </button>

            {/* PAGE NUMBERS */}

            <div className={styles.pageNumbersGrid}>
              {Array.from(
                {
                  length: pagination.totalPages,
                },
                (_, index) => {
                  const page = index + 1;

                  return (
                    <button
                      key={page}
                      className={`${styles.pageNumberPill} ${
                        currentPage === page ? styles.activePageNumberPill : ""
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  );
                },
              )}
            </div>

            {/* NEXT */}

            <button
              className={styles.pageArrowButton}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
            >
              Next &raquo;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BuyerOrders;
