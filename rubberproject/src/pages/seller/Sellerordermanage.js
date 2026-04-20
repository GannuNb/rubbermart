import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getSellerSingleOrderThunk,
  confirmSellerOrderThunk,
  rejectSellerOrderThunk,
} from "../../redux/slices/sellerOrderThunk";
import {
  clearSellerOrderMessages,
} from "../../redux/slices/sellerOrderSlice";
import styles from "../../styles/Seller/Sellerordermanage.module.css";

const Sellerordermanage = () => {
  const dispatch = useDispatch();
  const { orderId } = useParams();

  const [cancellationReason, setCancellationReason] = useState("");

  const {
    selectedOrder,
    singleOrderLoading,
    singleOrderError,
    confirmOrderLoading,
    rejectOrderLoading,
    confirmOrderSuccess,
    rejectOrderSuccess,
    confirmOrderError,
    rejectOrderError,
  } = useSelector((state) => state.sellerOrders);

  useEffect(() => {
    dispatch(getSellerSingleOrderThunk(orderId));
  }, [dispatch, orderId]);

  useEffect(() => {
    return () => {
      dispatch(clearSellerOrderMessages());
    };
  }, [dispatch]);

  const handleConfirmOrder = () => {
    dispatch(confirmSellerOrderThunk(orderId));
  };

  const handleRejectOrder = () => {
    dispatch(
      rejectSellerOrderThunk({
        orderId,
        cancellationReason,
      })
    );
  };

  if (singleOrderLoading) {
    return <div className={styles.loading}>Loading order...</div>;
  }

  if (singleOrderError) {
    return <div className={styles.error}>{singleOrderError}</div>;
  }

  if (!selectedOrder) {
    return <div className={styles.empty}>Order not found</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Manage Order</h1>

      <div className={styles.section}>
        <h2>Order Information</h2>

        <p>
          <strong>Order ID:</strong> {selectedOrder.orderId}
        </p>

        <p>
          <strong>Status:</strong> {selectedOrder.orderStatus}
        </p>

        <p>
          <strong>Total Amount:</strong> ₹ {selectedOrder.totalAmount}
        </p>

        <p>
          <strong>Buyer Name:</strong>{" "}
          {selectedOrder.buyer?.fullName}
        </p>

        <p>
          <strong>Buyer Email:</strong>{" "}
          {selectedOrder.buyer?.email}
        </p>
      </div>

      <div className={styles.section}>
        <h2>Shipping Address</h2>

        <p>{selectedOrder.shippingAddress?.fullAddress}</p>
      </div>

      <div className={styles.section}>
        <h2>Products</h2>

        <div className={styles.productsGrid}>
          {selectedOrder.orderItems?.map((item) => (
            <div key={item._id} className={styles.productCard}>
              <p>
                <strong>Product:</strong> {item.productName}
              </p>

              <p>
                <strong>Category:</strong> {item.category}
              </p>

              <p>
                <strong>Quantity:</strong> {item.requiredQuantity}
              </p>

              <p>
                <strong>Price / MT:</strong> ₹ {item.pricePerMT}
              </p>

              <p>
                <strong>Subtotal:</strong> ₹ {item.subtotal}
              </p>
            </div>
          ))}
        </div>
      </div>

      {confirmOrderSuccess && (
        <div className={styles.success}>{confirmOrderSuccess}</div>
      )}

      {rejectOrderSuccess && (
        <div className={styles.success}>{rejectOrderSuccess}</div>
      )}

      {confirmOrderError && (
        <div className={styles.error}>{confirmOrderError}</div>
      )}

      {rejectOrderError && (
        <div className={styles.error}>{rejectOrderError}</div>
      )}

      {selectedOrder.orderStatus === "pending" && (
        <div className={styles.actions}>
          <button
            className={styles.confirmButton}
            onClick={handleConfirmOrder}
            disabled={confirmOrderLoading}
          >
            {confirmOrderLoading ? "Confirming..." : "Confirm Order"}
          </button>

          <textarea
            className={styles.textarea}
            placeholder="Enter cancellation reason"
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
          />

          <button
            className={styles.rejectButton}
            onClick={handleRejectOrder}
            disabled={rejectOrderLoading}
          >
            {rejectOrderLoading ? "Rejecting..." : "Reject Order"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Sellerordermanage;