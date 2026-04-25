// src/pages/admin/AdminAllOrders.js

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdminAllOrders } from "../../redux/slices/adminOrders/adminOrderThunk";

import AdminOrdersSummaryCards from "../../components/admin/AdminOrdersSummaryCards";
import AdminOrdersFilters from "../../components/admin/AdminOrdersFilters";
import AdminOrdersTable from "../../components/admin/AdminOrdersTable";
import AdminOrdersPagination from "../../components/admin/AdminOrdersPagination";

import styles from "../../styles/Admin/AdminAllOrders.module.css";

const AdminAllOrders = () => {
  const dispatch = useDispatch();

  const {
    orders,
    counts,
    totalPages,
    totalOrders,
    adminOrdersLoading,
  } = useSelector((state) => state.adminOrders);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  // Date Filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
dispatch(
  getAdminAllOrders({
    page,
    limit: 10,
    search,
    status,
    fromDate,
    toDate,
  })
);
  }, [
    dispatch,
    page,
    search,
    status,
    fromDate,
    toDate,
  ]);

  return (
    <div className={styles.container}>
      {/* TOP HEADER */}
      <div className={styles.topHeader}>
        <div>
          <h1 className={styles.pageTitle}>
            Admin Orders
          </h1>

          <div className={styles.breadcrumb}>
            <span>Dashboard</span>
            <span>{">"}</span>
            <span>All Orders</span>
          </div>
        </div>

        <div className={styles.headerRight}>
          <input
            type="text"
            placeholder="Search by Order ID, Buyer, Email..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className={styles.topSearch}
          />

          <div className={styles.adminProfile}>
            <div className={styles.avatar}></div>
            <span>Admin</span>
          </div>
        </div>
      </div>

      {/* SUMMARY CARDS + DATE FILTERS SAME ROW */}
      <div className={styles.filterRow}>
        <AdminOrdersSummaryCards  counts={counts} status={status} setStatus={setStatus}/>
        <AdminOrdersFilters  fromDate={fromDate}  setFromDate={setFromDate}  toDate={toDate} setToDate={setToDate}  />
      </div>

      {/* TABLE */}
      {adminOrdersLoading ? (
        <p>Loading orders...</p>
      ) : (
        <AdminOrdersTable orders={orders} />
      )}

      {/* PAGINATION */}
      <AdminOrdersPagination page={page} setPage={setPage} totalPages={totalPages} totalOrders={totalOrders} />
    </div>
  );
};

export default AdminAllOrders;