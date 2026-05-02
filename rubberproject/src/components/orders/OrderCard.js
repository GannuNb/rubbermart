import React from "react";
import { FaTruck, FaArrowRight } from "react-icons/fa";
import {  getDisplayStatus,  getProgressClass,  getProgressLabels,} from "../../utils/orderStatusHelpers";
import styles from "../../styles/Buyer/BuyerOrders.module.css";

function OrderCard({ order, navigate }) {
  const firstItem = order.orderItems?.[0];

  const getMainProductImage = () => {
    if (firstItem?.productImage?.data) {
      let base64String = "";

      if (typeof firstItem.productImage.data === "string") {
        base64String = firstItem.productImage.data;
      } else if (firstItem.productImage.data?.data) {
        base64String = btoa(
          new Uint8Array(firstItem.productImage.data.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            "",
          ),
        );
      }

      return `data:${
        firstItem.productImage.contentType || "image/jpeg"
      };base64,${base64String}`;
    }

    return "/logo192.png";
  };

  const displayStatus = getDisplayStatus(order);
  const progressLabels = getProgressLabels(order);

  return (
    <div className={styles.orderCard}>
      {/* Header */}
      <div className={styles.cardHeader}>
        <div className={styles.statusPill}>{displayStatus}</div>

        <div className={styles.orderDate}>
          {new Date(order.createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* Body */}
      <div className={styles.cardBody}>
        <img
          src={getMainProductImage()}
          alt="product"
          className={styles.productImage}
        />

        <div className={styles.orderContent}>
          <h3>Order ID : {order.orderId}</h3>

          <p>
            {firstItem?.productName || firstItem?.application}
            {order.orderItems?.length > 1
              ? ` & ${order.orderItems.length - 1} more item`
              : ""}
          </p>

          <h2>
            ₹{Number(order.totalAmount).toLocaleString()}
          </h2>
        </div>

        <button
          className={styles.arrowButton}
          onClick={() =>
            navigate(`/buyer-orders/${order._id}`)
          }
        >
          <FaArrowRight />
        </button>
      </div>

      {/* Progress Bar */}
      <div className={styles.progressWrapper}>
        <div className={styles.progressBar}>
          <div
            className={`${styles.progressFill} ${getProgressClass(
              order,
              styles,
            )}`}
          />
        </div>

        <div className={styles.progressLabels}>
          <span>{progressLabels[0]}</span>
          <span>{progressLabels[1]}</span>
          <span>{progressLabels[2]}</span>
          <span>{progressLabels[3]}</span>
        </div>
      </div>

      {/* Bottom */}
      <div className={styles.bottomRow}>
        <button
          className={styles.trackButton}
          onClick={() =>
            navigate(`/buyer-orders/${order._id}`)
          }
        >
          <FaTruck />
          Track Item
        </button>
      </div>
    </div>
  );
}

export default OrderCard;