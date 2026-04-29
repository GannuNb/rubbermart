import React, { useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import AdminOrderSummaryCard from "../../components/admin/AdminOrderDetails/AdminOrderSummaryCard";
import AdminBuyerDetailsCard from "../../components/admin/AdminOrderDetails/AdminBuyerDetailsCard";
import AdminSellerDetailsCard from "../../components/admin/AdminOrderDetails/AdminSellerDetailsCard";
import AdminOrderItemsCard from "../../components/admin/AdminOrderDetails/AdminOrderItemsCard";
import AdminBuyerPaymentCard from "../../components/admin/AdminOrderDetails/AdminBuyerPaymentCard";
import AdminToSellerPaymentCard from "../../components/admin/AdminOrderDetails/AdminToSellerPaymentCard";
import AdminSellerPaymentHistoryCard from "../../components/admin/AdminOrderDetails/AdminSellerPaymentHistoryCard";
import AdminPaymentSummaryCard from "../../components/admin/AdminOrderDetails/AdminPaymentSummaryCard";
import { getAdminSingleOrderDetails } from "../../redux/slices/adminOrders/adminSingleOrderThunk";

import styles from "../../styles/Admin/AdminOrderDetails.module.css";

const AdminOrderDetails = () => {
  const dispatch = useDispatch();
  const { orderId } = useParams();

  const { singleOrder, singleOrderLoading, singleOrderError } = useSelector(
    (state) => state.adminOrders,
  );

  useEffect(() => {
    if (orderId) {
      dispatch(getAdminSingleOrderDetails(orderId));
    }
  }, [dispatch, orderId]);

  if (singleOrderLoading) {
    return <div className={styles.container}>Loading order details...</div>;
  }

  if (singleOrderError) {
    return <div className={styles.container}>{singleOrderError}</div>;
  }

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.pageHeader}>
        <h1 className={styles.mainTitle}>Admin Orders</h1>

        <div className={styles.adminProfile}>
          <div className={styles.avatar}></div>
          <span>Admin</span>
        </div>
      </div>

      {/* BREADCRUMB */}
      <div className={styles.breadcrumb}>
        <span>Orders</span>
        <span>{">"}</span>
        <span>All Orders</span>
        <span>{">"}</span>
        <span>Order Details</span>
      </div>

      {/* BACK */}
      <div className={styles.backSection}>
        <button className={styles.backBtn}>
          <FaArrowLeft />
        </button>

        <h2 className={styles.sectionTitle}>Order Details</h2>
      </div>

      {/* MAIN LAYOUT */}
      <div className={styles.mainLayout}>
        {/* LEFT SIDE */}
        <div className={styles.leftSection}>
          <AdminOrderSummaryCard order={singleOrder} />

          <AdminBuyerDetailsCard order={singleOrder} />

          <AdminSellerDetailsCard order={singleOrder} />

          <AdminOrderItemsCard order={singleOrder} />
        </div>

        {/* RIGHT SIDE */}
        <div className={styles.rightSection}>
          {/* Buyer Payment History */}
          <AdminBuyerPaymentCard order={singleOrder} />

          {/* Admin → Seller Payment */}
          <AdminToSellerPaymentCard order={singleOrder} />

          {/* Seller Payment History */}
          <AdminSellerPaymentHistoryCard order={singleOrder} />

          {/* Final Payment Summary */}
          <AdminPaymentSummaryCard order={singleOrder} />
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
