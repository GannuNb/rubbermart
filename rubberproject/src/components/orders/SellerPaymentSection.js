import React from "react";
import PaymentReceiptCard from "./PaymentReceiptCard";
import styles from "../../styles/Seller/SellerPaymentSection.module.css";

const SellerPaymentSection = ({ selectedOrder }) => {
  return (
    <div className={styles.section}>
      <h2 className={styles.heading}>Payment Details</h2>

      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <span>Total Amount</span>
          <strong>₹ {selectedOrder.totalAmount || 0}</strong>
        </div>

        <div className={styles.summaryCard}>
          <span>Received Amount</span>
          <strong>₹ {selectedOrder.buyerPaidAmount || 0}</strong>
        </div>

        <div className={styles.summaryCard}>
          <span>Remaining Amount</span>
          <strong>₹ {selectedOrder.buyerPendingAmount || 0}</strong>
        </div>

        <div className={styles.summaryCard}>
          <span>Payment Status</span>
          <strong>{selectedOrder.buyerPaymentStatus || "pending"}</strong>
        </div>
      </div>

      <div className={styles.receiptsSection}>
        <h3 className={styles.receiptsHeading}>Payment Receipts</h3>

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
          <div className={styles.noReceipts}>
            No payment receipts uploaded yet
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerPaymentSection;