// src/pages/Buyer/OrderSuccess.js

import React from "react";

import { useLocation, useNavigate } from "react-router-dom";

import {
  FaCheckCircle,
  FaBoxOpen,
  FaClipboardList,
  FaRupeeSign,
} from "react-icons/fa";

import styles from "../../styles/Buyer/OrderSuccess.module.css";

function OrderSuccess() {
  const location = useLocation();

  const navigate = useNavigate();

  /*
  =========================================
  ORDER DATA
  =========================================
  */

  const order = location.state?.order;

  /*
  =========================================
  EMPTY STATE
  =========================================
  */

  if (!order) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyCard}>
          <h2>No Order Found</h2>

          <p>Please place an order again.</p>

          <button
            className={styles.primaryButton}
            onClick={() => navigate("/our-products")}
          >
            Go To Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.successCard}>
        {/* SUCCESS ICON */}

        <div className={styles.iconWrapper}>
          <FaCheckCircle />
        </div>

        {/* TITLE */}

        <h1>Order Placed Successfully</h1>

        <p className={styles.description}>
          Your order has been created successfully and is now waiting for seller
          confirmation.
        </p>

        {/* ORDER DETAILS */}

        <div className={styles.orderInfoBox}>
          {/* ORDER ID */}

          <div className={styles.infoRow}>
            <div className={styles.infoLeft}>
              <FaClipboardList className={styles.rowIcon} />

              <span>Order ID</span>
            </div>

            <strong>{order.orderId}</strong>
          </div>

          {/* STATUS */}

          <div className={styles.infoRow}>
            <div className={styles.infoLeft}>
              <FaCheckCircle className={styles.rowIcon} />

              <span>Order Status</span>
            </div>

            <strong className={styles.statusBadge}>
              {order.orderStatus?.replace("_", " ")}
            </strong>
          </div>

          {/* TOTAL */}

          <div className={styles.infoRow}>
            <div className={styles.infoLeft}>
              <FaRupeeSign className={styles.rowIcon} />

              <span>Total Amount</span>
            </div>

            <strong>₹{Number(order.totalAmount || 0).toLocaleString()}</strong>
          </div>

          {/* PRODUCTS */}

          <div className={styles.infoRow}>
            <div className={styles.infoLeft}>
              <FaBoxOpen className={styles.rowIcon} />

              <span>Products</span>
            </div>

            <strong>{order.orderItems?.length || 0}</strong>
          </div>
        </div>

        {/* NOTICE */}

        <div className={styles.noticeBox}>
          <p>Invoice PDF has been sent to your registered email address.</p>

          <p>
            Payment receipt upload will be enabled after seller confirms this
            order.
          </p>
        </div>

        {/* BUTTONS */}

        <div className={styles.buttonRow}>
          <button
            className={styles.secondaryButton}
            onClick={() => navigate("/our-products")}
          >
            Continue Shopping
          </button>

          <button
            className={styles.primaryButton}
            onClick={() => navigate("/buyer-orders")}
          >
            View My Orders
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
