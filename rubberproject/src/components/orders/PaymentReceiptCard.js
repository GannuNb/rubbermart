import React from "react";
import styles from "../../styles/Seller/PaymentReceiptCard.module.css";

const PaymentReceiptCard = ({
  receipt,
}) => {
  /* =========================
     FILE URL
  ========================= */

  const fileUrl =
    receipt?.file?.data?.data &&
    receipt?.file?.contentType
      ? `data:${receipt.file.contentType};base64,${btoa(
          new Uint8Array(
            receipt.file.data.data
          ).reduce(
            (data, byte) =>
              data +
              String.fromCharCode(byte),
            ""
          )
        )}`
      : null;

  return (
    <div className={styles.card}>
      {/* AMOUNT */}

      <div className={styles.row}>
        <span>Amount</span>

        <strong>
          ₹ {receipt.amount || 0}
        </strong>
      </div>

      {/* PAYMENT MODE */}

      <div className={styles.row}>
        <span>Payment Mode</span>

        <strong>
          {receipt.paymentMode || "N/A"}
        </strong>
      </div>

      {/* TRANSACTION ID */}

      <div className={styles.row}>
        <span>Transaction ID</span>

        <strong>
          {receipt.transactionId || "N/A"}
        </strong>
      </div>

      {/* PAYMENT STATUS */}

      <div className={styles.row}>
        <span>Status</span>

        <strong>
          {receipt.status || "N/A"}
        </strong>
      </div>

      {/* UPLOADED DATE */}

      <div className={styles.row}>
        <span>Uploaded Date</span>

        <strong>
          {receipt.createdAt
            ? new Date(
                receipt.createdAt
              ).toLocaleDateString()
            : "N/A"}
        </strong>
      </div>

      {/* VIEW RECEIPT */}

      {fileUrl && (
        <a
          href={fileUrl}
          target="_blank"
          rel="noreferrer"
          className={
            styles.viewButton
          }
        >
          View Receipt
        </a>
      )}
    </div>
  );
};

export default PaymentReceiptCard;