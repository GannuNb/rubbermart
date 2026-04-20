// src/pages/OrderSuccess.js

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../styles/Buyer/OrderSuccess.module.css";

function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const order = location.state?.order;

  if (!order) {
    return (
      <div className={styles.emptyState}>
        <h2>No Order Found</h2>
        <p>Please place an order again.</p>

        <button
          className={styles.primaryButton}
          onClick={() => navigate("/ourproducts")}
        >
          Go To Products
        </button>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.successCard}>
        <div className={styles.iconWrapper}>✓</div>

        <h1>Order Placed Successfully</h1>

        <p className={styles.description}>
          Your order has been created successfully and is now waiting for seller
          confirmation.
        </p>

        <div className={styles.orderInfoBox}>
          <div className={styles.infoRow}>
            <span>Order ID</span>
            <strong>{order.orderId}</strong>
          </div>

          <div className={styles.infoRow}>
            <span>Order Status</span>
            <strong className={styles.statusBadge}>
              {order.orderStatus}
            </strong>
          </div>

          <div className={styles.infoRow}>
            <span>Total Amount</span>
            <strong>₹{Number(order.totalAmount).toLocaleString()}</strong>
          </div>

          <div className={styles.infoRow}>
            <span>Products</span>
            <strong>{order.orderItems?.length || 0}</strong>
          </div>
        </div>

        <div className={styles.noticeBox}>
          <p>
            Invoice PDF has been sent to your registered email address.
          </p>

          <p>
            You can upload payment receipt only after seller confirms this
            order.
          </p>
        </div>

        <div className={styles.buttonRow}>
          <button
            className={styles.secondaryButton}
            onClick={() => navigate("/ourproducts")}
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