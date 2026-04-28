import React, { useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import {
  useDispatch,
  useSelector,
} from "react-redux";
import {
  useParams,
  useNavigate,
} from "react-router-dom";

import AdminInvoicesSummaryCard from "../../components/admin/AdminInvoices/AdminInvoicesSummaryCard";
import AdminInvoicesTable from "../../components/admin/AdminInvoices/AdminInvoicesTable";

import { getAdminSingleOrderDetails } from "../../redux/slices/adminOrders/adminSingleOrderThunk";

import styles from "../../styles/Admin/AdminAllInvoices.module.css";

const AdminAllInvoices = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orderId, itemName } =
    useParams();

  const {
    singleOrder,
    singleOrderLoading,
    singleOrderError,
  } = useSelector(
    (state) => state.adminOrders
  );

  useEffect(() => {
    if (orderId) {
      dispatch(
        getAdminSingleOrderDetails(
          orderId
        )
      );
    }
  }, [dispatch, orderId]);

  if (singleOrderLoading) {
    return (
      <div className={styles.container}>
        Loading invoices...
      </div>
    );
  }

  if (singleOrderError) {
    return (
      <div className={styles.container}>
        {singleOrderError}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className={styles.pageHeader}>
        <h1 className={styles.mainTitle}>
          Admin Orders
        </h1>

        <div className={styles.adminProfile}>
          <div
            className={styles.avatar}
          ></div>
          <span>Admin</span>
        </div>
      </div>

      {/* =========================
          BREADCRUMB
      ========================= */}

      <div className={styles.breadcrumb}>
        <span>Orders</span>
        <span>{">"}</span>

        <span>All Orders</span>
        <span>{">"}</span>

        <span>Order Details</span>
        <span>{">"}</span>

        <span>Invoices</span>
      </div>

      {/* =========================
          BACK SECTION
      ========================= */}

      <div className={styles.backSection}>
        <button
          className={styles.backBtn}
          onClick={() =>
            navigate(
              `/admin/order-details/${orderId}`
            )
          }
        >
          <FaArrowLeft />
        </button>

        <h2
          className={styles.sectionTitle}
        >
          {decodeURIComponent(
            itemName || ""
          )}{" "}
          Invoices
        </h2>
      </div>

      {/* =========================
          SUMMARY CARD
      ========================= */}

      <AdminInvoicesSummaryCard
        order={singleOrder}
      />

      {/* =========================
          TABLE
      ========================= */}

      <AdminInvoicesTable
        order={singleOrder}
        itemName={decodeURIComponent(
          itemName || ""
        )}
      />
    </div>
  );
};

export default AdminAllInvoices;