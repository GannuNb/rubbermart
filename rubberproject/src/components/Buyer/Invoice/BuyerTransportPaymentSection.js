import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  FaTruck,
  FaMoneyBillWave,
  FaFileInvoice,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";

import { uploadTransportPaymentThunk } from "../../../redux/slices/buyer/uploadTransportPaymentThunk";

import styles from "../../../styles/Buyer/BuyerTransportPaymentSection.module.css";

const BuyerTransportPaymentSection = ({ shipment, order }) => {
  const dispatch = useDispatch();

  const {
    transportPaymentUploadLoading,

    transportPaymentUploadError,

    transportPaymentUploadSuccess,
  } = useSelector((state) => state.buyerOrders);

  /* =========================
     FORM STATE
  ========================= */

  const [amount, setAmount] = useState("");

  const [paymentMode, setPaymentMode] = useState("bank_transfer");

  const [transactionId, setTransactionId] = useState("");

  const [note, setNote] = useState("");

  const [receipt, setReceipt] = useState(null);

  /* =========================
     VALUES
  ========================= */

  const totalAmount = shipment?.transportFinalAmount || 0;

  const paymentReceipts = shipment?.transportPaymentReceipts || [];

  /* =========================
     VERIFIED PAYMENTS ONLY
  ========================= */

  const verifiedPaidAmount = paymentReceipts
    .filter((receipt) => receipt.status === "verified")
    .reduce((sum, receipt) => sum + Number(receipt.amount || 0), 0);

  /* =========================
     REMAINING
  ========================= */

  const remainingAmount = totalAmount - verifiedPaidAmount;

  /* =========================
     UPLOAD PAYMENT
  ========================= */

  const handleUploadPayment = () => {
    if (!amount) {
      return alert("Please enter payment amount");
    }

    const formData = new FormData();

    formData.append("amount", amount);

    formData.append("paymentMode", paymentMode);

    formData.append("transactionId", transactionId);

    formData.append("note", note);

    if (receipt) {
      formData.append("receipt", receipt);
    }

    dispatch(
      uploadTransportPaymentThunk({
        orderId: order?._id,

        shipmentId: shipment?._id,

        formData,
      }),
    );
  };

  /* =========================
     OPEN RECEIPT
  ========================= */

  const handleOpenReceipt = (file) => {
    if (!file?.data) {
      return alert("Receipt not found");
    }

    try {
      const byteArray = file.data.data;

      const uint8Array = new Uint8Array(byteArray);

      const blob = new Blob([uint8Array], {
        type: file.contentType || "application/pdf",
      });

      const fileURL = window.URL.createObjectURL(blob);

      window.open(fileURL, "_blank");
    } catch (error) {
      console.log(error);

      alert("Failed to open receipt");
    }
  };

  return (
    <div className={styles.paymentCard}>
      {/* HEADER */}

      <div className={styles.paymentHeader}>
        <div className={styles.headerLeft}>
          <FaTruck className={styles.paymentIcon} />

          <div>
            <h3>Transport Payment</h3>

            <p>Upload transport payment receipts</p>
          </div>
        </div>

        <span className={styles.statusBadge}>
          {shipment?.transportPaymentStatus}
        </span>
      </div>

      {/* SUMMARY */}

      <div className={styles.paymentSummaryGrid}>
        <div className={styles.summaryCard}>
          <p>Total Amount</p>

          <h4>₹ {totalAmount.toLocaleString("en-IN")}</h4>
        </div>

        <div className={styles.summaryCard}>
          <p>Verified Paid</p>

          <h4>₹ {verifiedPaidAmount.toLocaleString("en-IN")}</h4>
        </div>

        <div className={styles.summaryCard}>
          <p>Remaining Amount</p>

          <h4>₹ {remainingAmount.toLocaleString("en-IN")}</h4>
        </div>
      </div>

      {/* ALERTS */}

      {transportPaymentUploadError && (
        <div className={styles.errorBox}>{transportPaymentUploadError}</div>
      )}

      {transportPaymentUploadSuccess && (
        <div className={styles.successBox}>{transportPaymentUploadSuccess}</div>
      )}

      {/* FORM */}

      <div className={styles.paymentForm}>
        <div className={styles.formGrid}>
          {/* AMOUNT */}

          <div className={styles.formGroup}>
            <label>Payment Amount</label>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter payment amount"
            />
          </div>

          {/* MODE */}

          <div className={styles.formGroup}>
            <label>Payment Mode</label>

            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
            >
              <option value="bank_transfer">Bank Transfer</option>

              <option value="upi">UPI</option>

              <option value="cash">Cash</option>

              <option value="cheque">Cheque</option>

              <option value="rtgs">RTGS</option>

              <option value="neft">NEFT</option>
            </select>
          </div>
        </div>

        {/* TRANSACTION */}

        <div className={styles.formGroup}>
          <label>Transaction ID</label>

          <input
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="Enter transaction ID"
          />
        </div>

        {/* NOTE */}

        <div className={styles.formGroup}>
          <label>Payment Note</label>

          <textarea
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional note"
          />
        </div>

        {/* FILE */}

        <div className={styles.formGroup}>
          <label>Upload Receipt</label>

          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(e) => setReceipt(e.target.files[0])}
          />
        </div>

        {/* BUTTON */}

        <button
          className={styles.uploadBtn}
          onClick={handleUploadPayment}
          disabled={transportPaymentUploadLoading}
        >
          <FaMoneyBillWave />

          {transportPaymentUploadLoading ? "Uploading..." : "Upload Payment"}
        </button>
      </div>

      {/* HISTORY */}

      {paymentReceipts.length > 0 && (
        <div className={styles.historySection}>
          <h3 className={styles.historyTitle}>Payment History</h3>

          <div className={styles.historyGrid}>
            {paymentReceipts
              .slice()
              .reverse()
              .map((receipt, index) => (
                <div key={index} className={styles.historyCard}>
                  {/* TOP */}

                  <div className={styles.historyTop}>
                    <div>
                      <h4>
                        ₹ {Number(receipt.amount).toLocaleString("en-IN")}
                      </h4>

                      <p>{receipt.paymentMode}</p>
                    </div>

                    <div>
                      {receipt.status === "verified" ? (
                        <span className={styles.verifiedBadge}>
                          <FaCheckCircle />
                          Verified
                        </span>
                      ) : receipt.status === "rejected" ? (
                        <span className={styles.rejectedBadge}>
                          <FaTimesCircle />
                          Rejected
                        </span>
                      ) : (
                        <span className={styles.pendingBadge}>
                          <FaClock />
                          Pending
                        </span>
                      )}
                    </div>
                  </div>

                  {/* BODY */}

                  <div className={styles.historyBody}>
                    <p>
                      <strong>Transaction:</strong>{" "}
                      {receipt.transactionId || "-"}
                    </p>

                    {/* <p>
                      <strong>Remaining:</strong> ₹{" "}
                      {Number(receipt.remainingAmount || 0).toLocaleString(
                        "en-IN",
                      )}
                    </p> */}
                    <p>
                      <strong>Status:</strong>{" "}
                      {receipt.status === "verified"
                        ? "Amount approved by admin"
                        : receipt.status === "rejected"
                          ? "Payment rejected"
                          : "Waiting for admin verification"}
                    </p>

                    <p>
                      <strong>Payment:</strong>{" "}
                      {receipt.isFinalPayment
                        ? "Final Payment"
                        : "Partial Payment"}
                    </p>

                    <p>
                      <strong>Note:</strong> {receipt.note || "-"}
                    </p>
                  </div>

                  {/* RECEIPT */}

                  {receipt?.file?.data && (
                    <button
                      className={styles.receiptBtn}
                      onClick={() => handleOpenReceipt(receipt.file)}
                    >
                      <FaFileInvoice />
                      View Receipt
                    </button>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerTransportPaymentSection;
