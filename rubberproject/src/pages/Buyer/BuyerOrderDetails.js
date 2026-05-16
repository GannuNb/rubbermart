// src/pages/BuyerOrderDetails.js

import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import styles from "../../styles/Buyer/BuyerOrderDetails.module.css";

import OrderItemsSection from "../../components/orders/OrderItemsSection";
import OrderSummaryHeader from "../../components/orders/OrderSummaryHeader";
import DeliveryAddressCard from "../../components/orders/DeliveryAddressCard";
import PaymentUploadCard from "../../components/orders/PaymentUploadCard";
import PaymentSummaryCard from "../../components/orders/PaymentSummaryCard";

import { getBuyerSingleOrderThunk } from "../../redux/slices/buyerOrderThunk";
import { fetchProfileThunk } from "../../redux/slices/profileThunk";

function BuyerOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { singleOrder, singleOrderLoading, singleOrderError } = useSelector(
    (state) => state.buyerOrders,
  );

  const { user } = useSelector((state) => state.auth);
  const order = singleOrder;

  /* =========================
     FETCH ORDER DETAILS
  ========================= */

  useEffect(() => {
    if (id) {
      dispatch(getBuyerSingleOrderThunk(id));
    }
  }, [dispatch, id]);

  /* =========================
     REFETCH AFTER PAYMENT
  ========================= */

  const fetchOrderDetails = () => {
    if (id) {
      dispatch(getBuyerSingleOrderThunk(id));
    }
  };

  useEffect(() => {
  if (!user) {
    dispatch(fetchProfileThunk());
  }
}, [dispatch, user]);
  /* =========================
     LOADING
  ========================= */

  if (singleOrderLoading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.loadingText}>Loading order details...</div>
      </div>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (singleOrderError) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.emptyState}>{singleOrderError}</div>
      </div>
    );
  }

  /* =========================
     EMPTY
  ========================= */

  if (!order) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.emptyState}>Order not found</div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      {/* TOP HEADER */}

      {/* TOP HEADER */}

      <div className={styles.topHeaderCard}>
        <div className={styles.pageTitleSection}>
          <h1>My Orders</h1>
        </div>

        <div className={styles.profileIcon}>
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={user?.fullName || "Profile"}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className={styles.profileFallback}>
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}
        </div>
      </div>

      {/* MAIN CARD */}

      <div className={styles.contentCard}>
        {/* BACK */}

        <div className={styles.backBtn} onClick={() => navigate(-1)}>
          ← Back to Orders
        </div>

        {/* GRID */}

        <div className={styles.detailsGrid}>
          {/* LEFT */}

          <div className={styles.leftSection}>
            <OrderSummaryHeader order={order} />

            <OrderItemsSection order={order} />
          </div>

          {/* RIGHT */}

          <div className={styles.rightSection}>
            <DeliveryAddressCard order={order} />

            <PaymentUploadCard
              order={order}
              onPaymentUploaded={fetchOrderDetails}
            />

            <PaymentSummaryCard order={order} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuyerOrderDetails;
