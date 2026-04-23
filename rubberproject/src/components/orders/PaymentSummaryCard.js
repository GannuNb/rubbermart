import React from "react";
import styles from "../../styles/Buyer/BuyerOrderDetails.module.css";

function PaymentSummaryCard({ order }) {
  const receipts = order?.buyerPaymentReceipts || [];

  return (
    <div className={styles.paymentSummaryCard}>
      <h3 className={styles.cardTitle}>Payment Summary</h3>

      {/* SUMMARY */}
      <div className={styles.summaryRow}>
        <div>
          <p className={styles.label}>Total Amount</p>
          <h4>₹{Number(order.totalAmount).toLocaleString()}</h4>
        </div>

        <div>
          <p className={styles.label}>Paid</p>
          <h4 className={styles.paid}>
            ₹{Number(order.buyerPaidAmount).toLocaleString()}
          </h4>
        </div>

        <div>
          <p className={styles.label}>Remaining</p>
          <h4 className={styles.remaining}>
            ₹{Number(order.buyerPendingAmount).toLocaleString()}
          </h4>
        </div>
      </div>

      {/* TRANSACTION HISTORY */}
      <h4 className={styles.historyTitle}>Transaction History</h4>

      {receipts.length === 0 ? (
        <p className={styles.noHistory}>No payments yet</p>
      ) : (
        <div className={styles.historyList}>
          {receipts.map((receipt, index) => (
            <div key={index} className={styles.historyItem}>
              <div>
                <p className={styles.amountText}>
                  ₹{Number(receipt.amount).toLocaleString()}
                </p>

                <p className={styles.metaText}>
                  {receipt.paymentMode} •{" "}
                  {receipt.transactionId || "No Txn ID"}
                </p>

                <p className={styles.dateText}>
                  {new Date(receipt.createdAt).toLocaleString()}
                </p>
              </div>

              <div>
                <span
                  className={`${styles.statusBadge} ${
                    receipt.status === "verified"
                      ? styles.verified
                      : receipt.status === "rejected"
                      ? styles.rejected
                      : styles.pending
                  }`}
                >
                  {receipt.status || "pending"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PaymentSummaryCard;