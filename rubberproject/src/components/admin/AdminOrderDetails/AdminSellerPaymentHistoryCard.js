import React from "react";
import { FaWallet } from "react-icons/fa";

import styles from "../../../styles/Admin/AdminSellerPaymentHistoryCard.module.css";

const AdminSellerPaymentHistoryCard = ({ order }) => {
  const payments =
    order?.sellerPaymentReceipts || [];

  const handleViewReceipt = (file) => {
    if (!file || !file.data) {
      alert("Receipt file not found");
      return;
    }

    try {
      const byteArray = file.data.data;

      if (
        !byteArray ||
        !Array.isArray(byteArray)
      ) {
        alert("Invalid file data");
        return;
      }

      const uint8Array =
        new Uint8Array(byteArray);

      const blob = new Blob(
        [uint8Array],
        {
          type:
            file.contentType ||
            "application/pdf",
        }
      );

      const fileURL =
        window.URL.createObjectURL(blob);

      window.open(fileURL, "_blank");
    } catch (error) {
      console.log(error);
      alert("Failed to open receipt");
    }
  };

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.cardHeader}>
        <div className={styles.iconBox}>
          <FaWallet />
        </div>

        <h3>
          Seller Payment History
        </h3>
      </div>

      {payments.length > 0 ? (
        payments.map((payment, index) => (
          <div
            key={payment._id || index}
            className={styles.paymentBox}
          >
            <div className={styles.paymentTitle}>
              Payment #{index + 1}
            </div>

            <div className={styles.details}>
              <div className={styles.row}>
                <span>Amount</span>
                <strong>
                  ₹ {payment?.amount || 0}
                </strong>
              </div>

              <div className={styles.row}>
                <span>Payment Mode</span>
                <strong>
                  {payment?.paymentMode || "-"}
                </strong>
              </div>

              <div className={styles.row}>
                <span>Transaction ID</span>
                <strong>
                  {payment?.transactionId || "-"}
                </strong>
              </div>

              <div className={styles.row}>
                <span>Status</span>
                <strong>
                  {payment?.status || "-"}
                </strong>
              </div>

              <div className={styles.row}>
                <span>Total Paid</span>
                <strong>
                  ₹ {payment?.totalPaidTillNow || 0}
                </strong>
              </div>

              <div className={styles.row}>
                <span>Remaining</span>
                <strong>
                  ₹ {payment?.remainingAmount || 0}
                </strong>
              </div>
            </div>

            <button
              className={styles.viewBtn}
              onClick={() =>
                handleViewReceipt(
                  payment?.file
                )
              }
            >
              View Receipt
            </button>
          </div>
        ))
      ) : (
        <p className={styles.emptyText}>
          No seller payments yet
        </p>
      )}
    </div>
  );
};

export default AdminSellerPaymentHistoryCard;