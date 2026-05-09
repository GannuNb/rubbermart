import React from "react";
import PaymentReceiptCard from "./PaymentReceiptCard";
import styles from "../../styles/Seller/SellerPaymentSection.module.css";
import {
  FiCreditCard,
  FiCheckCircle,
  FiClock,
  FiFileText,
} from "react-icons/fi";

const SellerPaymentSection = ({ selectedOrder }) => {
  return (
    <div className={styles.section}>
      <h2 className={styles.heading}>
        <span className={styles.headingIcon}>
          <FiCreditCard />
        </span>
        Payment Details
      </h2>

      <div className={styles.paymentLayout}>
        {/* Left Summary */}
        <div className={styles.leftPanel}>
          <div className={styles.amountCard}>
            <span>Total Amount</span>
            <h3>₹ {selectedOrder.totalAmount || 0}</h3>
          </div>

          <div className={styles.dualRow}>
            <div className={styles.smallCard}>
              <span>Received</span>
              <strong>₹ {selectedOrder.buyerPaidAmount || 0}</strong>
            </div>

            <div className={styles.smallCard}>
              <span>Remaining</span>
              <strong>₹ {selectedOrder.buyerPendingAmount || 0}</strong>
            </div>
          </div>
        </div>

        {/* Right Status */}
        <div className={styles.rightPanel}>
          <div className={styles.statusCard}>
            <FiCheckCircle className={styles.statusIcon} />

            <span>Payment Status</span>

            <h4>{selectedOrder.buyerPaymentStatus || "Pending"}</h4>

            <p>Track buyer payment progress and receipts.</p>
          </div>
        </div>
      </div>

      {/* Receipts */}
      <div className={styles.receiptsSection}>
        <h3 className={styles.receiptsHeading}>
          <FiFileText />
          Payment Receipts
        </h3>

        {selectedOrder.buyerPaymentReceipts?.length > 0 ? (
          <div className={styles.receiptsGrid}>
            {selectedOrder.buyerPaymentReceipts.map((receipt) => (
              <PaymentReceiptCard
                key={receipt._id}
                receipt={receipt}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyReceiptBox}>
            <FiClock className={styles.emptyIcon} />
            <h4>No Payment Receipts Yet</h4>
            <p>
              Buyer uploaded payment receipts will appear here
              once submitted.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerPaymentSection;