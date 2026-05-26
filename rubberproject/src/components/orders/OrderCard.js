import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { FaTruck, FaArrowRight } from "react-icons/fa";

import ReviewModal from "./ReviewModal";

import {
  getDisplayStatus,
  getProgressClass,
  getProgressLabels,
} from "../../utils/orderStatusHelpers";
import { cancelBuyerOrderThunk } from "../../redux/slices/getBuyerOrdersThunk";

import styles from "../../styles/Buyer/BuyerOrders.module.css";

function OrderCard({ order, navigate }) {
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [showCancelBox, setShowCancelBox] = useState(false);

  const [cancellationReason, setCancellationReason] = useState("");

  const dispatch = useDispatch();

  const { cancelOrderLoading } = useSelector((state) => state.buyerOrders);

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

  const canReview =
    order.orderStatus === "delivered" || order.orderStatus === "completed";

  const canCancel = ["pending", "seller_confirmed"].includes(order.orderStatus);

  const handleCancelOrder = () => {
    if (!cancellationReason.trim()) {
      return alert("Please enter cancellation reason");
    }

    dispatch(
      cancelBuyerOrderThunk({
        orderId: order._id,

        cancellationReason,
      }),
    ).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        setShowCancelBox(false);

        setCancellationReason("");
      }
    });
  };

  return (
    <>
      <div
        className={styles.orderCard}
        onClick={() => navigate(`/buyer-orders/${order._id}`)}
        style={{ cursor: "pointer" }}
      >
        {/* Header */}

        <div className={styles.cardHeader}>
          <div
            className={`${styles.statusPill} ${
              order.orderStatus === "cancelled"
                ? styles.cancelledStatusPill
                : ""
            }`}
          >
            {displayStatus}
          </div>

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

            <h2>₹{Number(order.totalAmount).toLocaleString()}</h2>
          </div>

          <div className={styles.arrowButton}>
            <FaArrowRight />
          </div>
        </div>

        {/* Progress Bar */}

        {/* Progress Section */}

        <div className={styles.progressWrapper}>
          {order.orderStatus === "cancelled" ? (
            <div className={styles.cancelledProgressCard}>
              <div className={styles.cancelledTop}>
                <div className={styles.cancelledIcon}>✕</div>

                <div>
                  <h3>Order Cancelled</h3>

                  <p>Your order has been cancelled.</p>
                </div>
              </div>

              <div className={styles.progressBar}>
                <div
                  className={`${styles.progressFill} ${styles.cancelledProgress}`}
                />
              </div>
            </div>
          ) : (
            <>
              <div className={styles.progressBar}>
                <div
                  className={`${styles.progressFill} ${getProgressClass(
                    order,
                    styles,
                  )}`}
                />
              </div>

              {/* Desktop labels */}

              <div className={styles.progressLabels}>
                <span>{progressLabels[0]}</span>

                <span>{progressLabels[1]}</span>

                <span>{progressLabels[2]}</span>

                <span>{progressLabels[3]}</span>
              </div>

              {/* Mobile status */}

              <div className={styles.mobileProgressText}>{displayStatus}</div>
            </>
          )}
        </div>

        {/* Bottom */}

        <div className={styles.bottomRow}>
          <div className={styles.trackButton}>
            <FaTruck />
            Track Item
          </div>
          {canCancel && (
            <button
              className={styles.orderCancelBtn}
              onClick={(e) => {
                e.stopPropagation();

                setShowCancelBox(true);
              }}
            >
              Cancel Order
            </button>
          )}
          {canReview && (
            <button
              className={styles.orderReviewBtn}
              onClick={(e) => {
                e.stopPropagation();

                setShowReviewModal(true);
              }}
            >
              {order.isReviewed ? "Edit Review" : "Write Review"}
            </button>
          )}
        </div>
      </div>

      {/* CANCEL ORDER MODAL */}

      {showCancelBox && (
        <div
          className={styles.cancelModalOverlay}
          onClick={(e) => {
            e.stopPropagation();

            setShowCancelBox(false);
          }}
        >
          <div
            className={styles.cancelModal}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Cancel Order</h2>

            <p>Please provide a cancellation reason.</p>

            <textarea
              className={styles.cancelTextarea}
              placeholder="Enter cancellation reason..."
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
            />

            <div className={styles.cancelModalButtons}>
              <button
                className={styles.keepOrderBtn}
                onClick={() => setShowCancelBox(false)}
              >
                Keep Order
              </button>

              <button
                className={styles.confirmCancelBtn}
                onClick={handleCancelOrder}
                disabled={cancelOrderLoading}
              >
                {cancelOrderLoading ? "Cancelling..." : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* REVIEW MODAL */}

      {showReviewModal && (
        <ReviewModal order={order} onClose={() => setShowReviewModal(false)} />
      )}
    </>
  );
}

export default OrderCard;
