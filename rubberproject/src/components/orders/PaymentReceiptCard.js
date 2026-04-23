import React from "react";
import styles from "../../styles/Seller/PaymentReceiptCard.module.css";

const PaymentReceiptCard = ({ receipt }) => {
  const fileUrl =
    receipt?.receiptFile?.data?.data &&
    receipt?.receiptFile?.contentType
      ? `data:${receipt.receiptFile.contentType};base64,${btoa(
          new Uint8Array(receipt.receiptFile.data.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        )}`
      : null;

  return (
    <div className={styles.card}>
      <div className={styles.row}>
        <span>Amount</span>
        <strong>₹ {receipt.amount || 0}</strong>
      </div>

      <div className={styles.row}>
        <span>Payment Method</span>
        <strong>{receipt.paymentMethod || "N/A"}</strong>
      </div>

      <div className={styles.row}>
        <span>Reference Number</span>
        <strong>{receipt.referenceNumber || "N/A"}</strong>
      </div>

      <div className={styles.row}>
        <span>Uploaded Date</span>
        <strong>
          {receipt.createdAt
            ? new Date(receipt.createdAt).toLocaleDateString()
            : "N/A"}
        </strong>
      </div>

      {fileUrl && (
        <a
          href={fileUrl}
          target="_blank"
          rel="noreferrer"
          className={styles.viewButton}
        >
          View Receipt
        </a>
      )}
    </div>
  );
};

export default PaymentReceiptCard;