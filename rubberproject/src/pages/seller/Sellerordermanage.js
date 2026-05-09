import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getSellerSingleOrderThunk,
  confirmSellerOrderThunk,
  rejectSellerOrderThunk,
} from "../../redux/slices/sellerOrderThunk";
import { clearSellerOrderMessages } from "../../redux/slices/sellerOrderSlice";
import SellerPaymentSection from "../../components/orders/SellerPaymentSection";
import SellerShipmentSection from "../../components/orders/SellerShipmentSection";
import styles from "../../styles/Seller/Sellerordermanage.module.css";

import {
  FiShoppingBag,
  FiMapPin,
  FiBox,
  FiCreditCard,
  FiTruck,
  FiSettings,
} from "react-icons/fi";

const Sellerordermanage = () => {
  const dispatch = useDispatch();
  const { orderId } = useParams();

  const [cancellationReason, setCancellationReason] = useState("");

  const productsRef = useRef(null);
  const paymentRef = useRef(null);
  const shipmentRef = useRef(null);
  const actionsRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

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
    if (!cancellationReason.trim()) {
      alert("Please enter rejection reason");
      return;
    }

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
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerWrapper}>
          <div className={styles.headerTitle}>
            <div className={styles.headerIcon}>
              <FiShoppingBag />
            </div>

            <div>
              <h1 className={styles.heading}>Manage Order</h1>
              <p className={styles.subHeading}>
                View and manage your order details, shipments and payments.
              </p>
            </div>
          </div>

          <div className={styles.orderIdCard}>
            {selectedOrder.orderId}
          </div>
        </div>
      </div>

      {/* Quick Navigation Tabs */}
      <div className={styles.quickTabs}>
        <button onClick={() => scrollToSection(productsRef)}>
          <FiBox /> Products
        </button>

        <button onClick={() => scrollToSection(paymentRef)}>
          <FiCreditCard /> Payment
        </button>

        <button onClick={() => scrollToSection(shipmentRef)}>
          <FiTruck /> Shipment
        </button>

        {selectedOrder.orderStatus === "pending" && (
          <button onClick={() => scrollToSection(actionsRef)}>
            <FiSettings /> Accept / Reject Order
          </button>
        )}
      </div>

      {/* Order Information */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <FiShoppingBag className={styles.sectionIcon} />
          Order Information
        </h2>

        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span>Order ID</span>
            <strong>{selectedOrder.orderId}</strong>
          </div>

          <div className={styles.infoItem}>
            <span>Status</span>
            <strong className={styles.statusBadge}>
              {selectedOrder.orderStatus}
            </strong>
          </div>

          <div className={styles.infoItem}>
            <span>Total Amount</span>
            <strong>₹ {selectedOrder.totalAmount}</strong>
          </div>

          <div className={styles.infoItem}>
            <span>Buyer Name</span>
            <strong>{selectedOrder.buyer?.fullName}</strong>
          </div>

          <div className={styles.infoItem}>
            <span>Buyer Email</span>
            <strong>{selectedOrder.buyer?.email}</strong>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <FiMapPin className={styles.sectionIcon} />
          Shipping Address
        </h2>

        <p className={styles.address}>
          {selectedOrder.shippingAddress?.fullAddress}
        </p>
      </div>

      {/* Products */}
      <div ref={productsRef} className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <FiBox className={styles.sectionIcon} />
          Products
        </h2>

        <div className={styles.productsGrid}>
          {selectedOrder.orderItems?.map((item) => (
            <div key={item._id} className={styles.productCard}>
              <div>
                <h3>{item.productName}</h3>
                <p>Category : {item.category}</p>
                <p>Quantity : {item.requiredQuantity}</p>
              </div>

              <div className={styles.productPrice}>
                <p>Price / MT : ₹ {item.pricePerMT}</p>
                <strong>Subtotal : ₹ {item.subtotal}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment */}
      <div ref={paymentRef}>
        <SellerPaymentSection selectedOrder={selectedOrder} />
      </div>

      {/* Shipment */}
      <div ref={shipmentRef}>
        <SellerShipmentSection selectedOrder={selectedOrder} />
      </div>

      {/* Messages */}
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

      {/* Actions */}
      {selectedOrder.orderStatus === "pending" && (
        <div ref={actionsRef} className={styles.actionsSection}>
          <h2 className={styles.actionsHeading}>
            <span className={styles.actionsIcon}>⚙️</span>
            Actions
          </h2>

          <div className={styles.actionsGrid}>
            {/* Confirm Order */}
            <div className={styles.confirmCard}>
              <div className={styles.cardHeader}>
                <span className={styles.greenIcon}>✔</span>
                <h3>Confirm Order</h3>
              </div>

              <p>
                Please confirm the order after reviewing all order details.
                Once confirmed, the buyer will be notified.
              </p>

              <button
                className={styles.confirmButton}
                onClick={handleConfirmOrder}
                disabled={confirmOrderLoading}
              >
                {confirmOrderLoading ? "Confirming..." : "Confirm Order"}
              </button>
            </div>

            {/* Reject Order */}
            <div className={styles.cancelCard}>
              <div className={styles.cardHeader}>
                <span className={styles.redIcon}>✕</span>
                <h3>Reject Order</h3>
              </div>

              <p>
                If you want to reject this order, please provide a valid
                reason. The buyer will be notified after rejection.
              </p>

              <label className={styles.inputLabel}>
                Rejection Reason *
              </label>

              <textarea
                className={styles.textarea}
                placeholder="Enter rejection reason..."
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                required
              />

              <button
                className={styles.rejectButton}
                onClick={handleRejectOrder}
                disabled={rejectOrderLoading}
              >
                {rejectOrderLoading ? "Rejecting..." : "Reject Order"}
              </button>
            </div>
          </div>

          <div className={styles.warningNote}>
            ℹ Please review all order details carefully before confirming
            or rejecting this order.
          </div>
        </div>
      )}
    </div>
  );
};

export default Sellerordermanage;