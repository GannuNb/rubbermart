import React from "react";
import PaymentReceiptCard from "./PaymentReceiptCard";
import styles from "../../styles/Seller/SellerPaymentSection.module.css";

import {
  FiCreditCard,
  FiCheckCircle,
  FiClock,
  FiFileText,
} from "react-icons/fi";

const SellerPaymentSection = ({
  selectedOrder,
}) => {
  return (
    <div className={styles.section}>
      <h2 className={styles.heading}>
        <span className={styles.headingIcon}>
          <FiCreditCard />
        </span>

        Seller Payment Details
      </h2>

      <div className={styles.paymentLayout}>
        {/* LEFT SUMMARY */}

        <div className={styles.leftPanel}>
          <div className={styles.amountCard}>
            <span>Total Amount</span>

            <h3>
              ₹ {selectedOrder.totalAmount || 0}
            </h3>
          </div>

          <div className={styles.dualRow}>
            {/* RECEIVED */}

            <div className={styles.smallCard}>
              <span>Received From Admin</span>

              <strong>
                ₹{" "}
                {selectedOrder.sellerPaidAmount ||
                  0}
              </strong>
            </div>

            {/* REMAINING */}

            <div className={styles.smallCard}>
              <span>Pending From Admin</span>

              <strong>
                ₹{" "}
                {selectedOrder.sellerPendingAmount ||
                  0}
              </strong>
            </div>
          </div>
        </div>

        {/* RIGHT STATUS */}

        <div className={styles.rightPanel}>
          <div className={styles.statusCard}>
            <FiCheckCircle
              className={styles.statusIcon}
            />

            <span>Payment Status</span>

            <h4>
              {selectedOrder.sellerPaymentStatus ||
                "Pending"}
            </h4>

            <p>
              Track payments received from admin.
            </p>
          </div>
        </div>
      </div>

      {/* RECEIPTS */}

      <div className={styles.receiptsSection}>
        <h3 className={styles.receiptsHeading}>
          <FiFileText />

          Seller Payment Receipts
        </h3>

        {selectedOrder
          .sellerPaymentReceipts?.length >
        0 ? (
          <div className={styles.receiptsGrid}>
            {selectedOrder.sellerPaymentReceipts.map(
              (receipt) => (
                <PaymentReceiptCard
                  key={receipt._id}
                  receipt={receipt}
                />
              )
            )}
          </div>
        ) : (
          <div
            className={
              styles.emptyReceiptBox
            }
          >
            <FiClock
              className={styles.emptyIcon}
            />

            <h4>
              No Seller Payments Yet
            </h4>

            <p>
              Admin payment receipts will
              appear here once payment is
              sent.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerPaymentSection;