import React from "react";
import styles from "../../styles/Seller/PaymentReceiptCard.module.css";

const PaymentReceiptCard = ({ receipt }) => {
  /* =========================
     FILE URL
  ========================= */

  const handleViewReceipt = (file) => {
    if (!file || !file.data) return;

    const uint8Array = new Uint8Array(file.data.data);

    const blob = new Blob([uint8Array], {
      type: file.contentType,
    });

    const fileURL = window.URL.createObjectURL(blob);

    window.open(fileURL, "_blank");
  };

  return (
    <div className={styles.card}>
      {/* AMOUNT */}

      <div className={styles.row}>
        <span>Amount</span>

        <strong>₹ {receipt.amount || 0}</strong>
      </div>

      {/* PAYMENT MODE */}

      <div className={styles.row}>
        <span>Payment Mode</span>

        <strong>{receipt.paymentMode || "N/A"}</strong>
      </div>

      {/* TRANSACTION ID */}

      <div className={styles.row}>
        <span>Transaction ID</span>

        <strong>{receipt.transactionId || "N/A"}</strong>
      </div>

      {/* PAYMENT STATUS */}

      <div className={styles.row}>
        <span>Status</span>

        <strong>{receipt.status || "N/A"}</strong>
      </div>

      {/* UPLOADED DATE */}

      <div className={styles.row}>
        <span>Uploaded Date</span>

        <strong>
          {receipt.createdAt
            ? new Date(receipt.createdAt).toLocaleDateString()
            : "N/A"}
        </strong>
      </div>

      {/* VIEW RECEIPT */}

      {receipt?.file && (
        <button
          type="button"
          className={styles.viewButton}
          onClick={() => handleViewReceipt(receipt.file)}
        >
          View Receipt
        </button>
      )}
    </div>
  );
};

export default PaymentReceiptCard;
