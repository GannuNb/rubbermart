import React, { useState } from "react";
import styles from "../../styles/Buyer/BuyerOrderDetails.module.css";

function PaymentSummaryCard({ order }) {
  const [isOpen, setIsOpen] = useState(false); // Controls accordion visibility
  const receipts = order?.buyerPaymentReceipts || [];

  // ✅ ONLY VERIFIED
  const verifiedReceipts = receipts.filter((r) => r.status === "verified");

  const totalPaid = verifiedReceipts.reduce(
    (sum, r) => sum + Number(r.amount || 0),
    0,
  );

  const remaining = Number(order.totalAmount) - totalPaid;

  return (
    <div className={styles.paymentSummaryCard}>
      {/* Clickable Header Toggle */}
      <div className={styles.dropdownHeader} onClick={() => setIsOpen(!isOpen)}>
        <h3 className={styles.cardTitle}>Transactions</h3>
        <span
          className={`${styles.toggleIcon} ${isOpen ? styles.iconActive : ""}`}
        >
          {isOpen ? "−" : "+"}
        </span>
      </div>

      {/* Conditional Content Panel */}
      {isOpen && (
        <div className={styles.dropdownContent}>
          {/* SUMMARY */}
          <div className={styles.summaryRow}>
            <div>
              <p className={styles.label}>Total Amount Paid</p>
              <h4>₹{totalPaid.toLocaleString()}</h4>
            </div>

            {order?.orderStatus === "cancelled" ? (
              <div>
                <p className={styles.label}>Refunded Amount</p>
                <h4>
                  ₹{Number(order?.buyerRefundedAmount || 0).toLocaleString()}
                </h4>
              </div>
            ) : (
              <div>
                <p className={styles.label}>Remaining Amount</p>
                <h4>₹{remaining.toLocaleString()}</h4>
              </div>
            )}
          </div>

          {/* STATUS */}
          {remaining === 0 && (
            <div className={styles.paidFullBox}>Paid in Full ✅</div>
          )}

          {/* HISTORY */}
          <div className={styles.historyList}>
            {receipts.length === 0 ? (
              <p className={styles.noHistory}>No transaction history found</p>
            ) : (
              receipts.map((r, i) => (
                <div key={i} className={styles.historyItem}>
                  <div>₹{Number(r.amount).toLocaleString()}</div>

                  <div
                    className={`${styles.statusBadge} ${
                      r.isRefunded
                        ? styles.refunded
                        : r.status === "verified"
                          ? styles.verified
                          : r.status === "rejected"
                            ? styles.rejected
                            : styles.pending
                    }`}
                  >
                    {r.isRefunded
                      ? `Refunded (₹${r.refundedAmount || 0})`
                      : r.status || "pending"}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentSummaryCard;
