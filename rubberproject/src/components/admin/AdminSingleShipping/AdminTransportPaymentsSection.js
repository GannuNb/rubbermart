import React, { useState } from "react";

import {
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaFileInvoice,
  FaTruck,
  FaUpload,
} from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";

import { verifyBuyerTransportPaymentThunk } from "../../../redux/slices/adminOrders/adminSingleOrderThunk";

import { uploadAdminTransportPaymentThunk } from "../../../redux/slices/adminOrders/uploadAdminTransportPaymentThunk";

import styles from "../../../styles/Admin/AdminTransportPaymentsSection.module.css";

const AdminTransportPaymentsSection = ({ shipment, order }) => {
  const dispatch = useDispatch();

  const {
    adminTransportPaymentLoading,
    adminTransportPaymentError,
    adminTransportPaymentSuccess,
  } = useSelector((state) => state.adminOrders);

  /* =========================
     BUYER PAYMENTS
  ========================= */

  const buyerPayments = shipment?.transportPaymentReceipts || [];

  /* =========================
     VERIFIED BUYER
  ========================= */

  const verifiedBuyerAmount = buyerPayments
    .filter((r) => r.status === "verified")
    .reduce((sum, r) => sum + Number(r.amount || 0), 0);

  /* =========================
     BUYER REMAINING
  ========================= */

  const buyerRemainingAmount =
    Number(shipment?.transportFinalAmount || 0) - verifiedBuyerAmount;

  /* =========================
     TRANSPORTER PAYMENTS
  ========================= */

  const transporterPayments = shipment?.adminTransportPaymentReceipts || [];

  /* =========================
     VERIFIED TRANSPORTER
  ========================= */

  const transporterPaidAmount = transporterPayments
    .filter((r) => r.status === "verified")
    .reduce((sum, r) => sum + Number(r.amount || 0), 0);

  /* =========================
     TRANSPORTER REMAINING
  ========================= */

  const transporterRemainingAmount =
    Number(shipment?.transportFinalAmount || 0) - transporterPaidAmount;

  /* =========================
     FORM STATE
  ========================= */

  const [amount, setAmount] = useState("");

  const [paymentMode, setPaymentMode] = useState("bank_transfer");

  const [transactionId, setTransactionId] = useState("");

  const [note, setNote] = useState("");

  const [receipt, setReceipt] = useState(null);

  /* =========================
     VERIFY / REJECT
  ========================= */

  const handleAction = (receiptId, action) => {
    dispatch(
      verifyBuyerTransportPaymentThunk({
        orderId: order?._id,

        shipmentId: shipment?._id,

        receiptId,

        action,
      }),
    );
  };

  /* =========================
     OPEN RECEIPT
  ========================= */

  const handleOpenReceipt = (file) => {
    try {
      if (!file?.data) {
        return alert("Receipt not found");
      }

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

  /* =========================
     UPLOAD TRANSPORTER PAYMENT
  ========================= */

  const handleUploadTransporterPayment = () => {
    if (!amount) {
      return alert("Please enter amount");
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
      uploadAdminTransportPaymentThunk({
        orderId: order?._id,

        shipmentId: shipment?._id,

        formData,
      }),
    );

    setAmount("");
    setTransactionId("");
    setNote("");
    setReceipt(null);
  };

  return (
    <div className={styles.wrapper}>
      {/* HEADER */}

      <div className={styles.header}>
        <FaMoneyBillWave className={styles.headerIcon} />

        <div>
          <h2>Transport Payments</h2>

          <p>Buyer receipts & transporter payments</p>
        </div>
      </div>

      {/* SUMMARY */}

      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <p>Buyer Verified</p>

          <h3>₹ {verifiedBuyerAmount.toLocaleString("en-IN")}</h3>
        </div>

        <div className={styles.summaryCard}>
          <p>Buyer Remaining</p>

          <h3>₹ {buyerRemainingAmount.toLocaleString("en-IN")}</h3>
        </div>

        <div className={styles.summaryCard}>
          <p>Paid To Transporter</p>

          <h3>₹ {transporterPaidAmount.toLocaleString("en-IN")}</h3>
        </div>

        <div className={styles.summaryCard}>
          <p>Remaining To Pay</p>

          <h3>₹ {transporterRemainingAmount.toLocaleString("en-IN")}</h3>
        </div>
      </div>

      {/* TRANSPORTER FORM */}

      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <FaTruck />

          <h3>Pay Transporter</h3>
        </div>

        {adminTransportPaymentError && (
          <div className={styles.errorBox}>{adminTransportPaymentError}</div>
        )}

        {adminTransportPaymentSuccess && (
          <div className={styles.successBox}>
            {adminTransportPaymentSuccess}
          </div>
        )}

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Amount</label>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>

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

        <div className={styles.formGroup}>
          <label>Transaction ID</label>

          <input
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="Enter transaction ID"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Note</label>

          <textarea
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional note"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Upload Receipt</label>

          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(e) => setReceipt(e.target.files[0])}
          />
        </div>

        <button
          className={styles.uploadBtn}
          onClick={handleUploadTransporterPayment}
          disabled={adminTransportPaymentLoading}
        >
          <FaUpload />

          {adminTransportPaymentLoading
            ? "Uploading..."
            : "Upload Transporter Payment"}
        </button>
      </div>

      {/* BUYER PAYMENTS */}

      <div className={styles.sectionBlock}>
        <h3 className={styles.sectionTitle}>Buyer Payment History</h3>

        {buyerPayments.length === 0 ? (
          <div className={styles.emptyBox}>No buyer payments</div>
        ) : (
          <div className={styles.cardsGrid}>
            {buyerPayments
              .slice()
              .reverse()
              .map((receipt) => (
                <div key={receipt?._id} className={styles.paymentCard}>
                  <div className={styles.cardTop}>
                    <div>
                      <h3>
                        ₹ {Number(receipt?.amount || 0).toLocaleString("en-IN")}
                      </h3>

                      <p>{receipt?.paymentMode}</p>
                    </div>

                    {receipt?.status === "verified" ? (
                      <span className={styles.verifiedBadge}>
                        <FaCheckCircle />
                        Verified
                      </span>
                    ) : receipt?.status === "rejected" ? (
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

                  <div className={styles.cardBody}>
                    <p>
                      <strong>Transaction:</strong>{" "}
                      {receipt?.transactionId || "-"}
                    </p>

                    <p>
                      <strong>Note:</strong> {receipt?.note || "-"}
                    </p>
                  </div>

                  {receipt?.file?.data && (
                    <button
                      className={styles.receiptBtn}
                      onClick={() => handleOpenReceipt(receipt.file)}
                    >
                      <FaFileInvoice />
                      View Receipt
                    </button>
                  )}

                  {receipt?.status === "pending" && (
                    <div className={styles.actionsRow}>
                      <button
                        className={styles.verifyBtn}
                        onClick={() => handleAction(receipt._id, "verified")}
                      >
                        Approve
                      </button>

                      <button
                        className={styles.rejectBtn}
                        onClick={() => handleAction(receipt._id, "rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* TRANSPORTER PAYMENTS */}

      <div className={styles.sectionBlock}>
        <h3 className={styles.sectionTitle}>Transporter Payment History</h3>

        {transporterPayments.length === 0 ? (
          <div className={styles.emptyBox}>No transporter payments</div>
        ) : (
          <div className={styles.cardsGrid}>
            {transporterPayments
              .slice()
              .reverse()
              .map((receipt) => (
                <div key={receipt?._id} className={styles.paymentCard}>
                  <div className={styles.cardTop}>
                    <div>
                      <h3>
                        ₹ {Number(receipt?.amount || 0).toLocaleString("en-IN")}
                      </h3>

                      <p>{receipt?.paymentMode}</p>
                    </div>

                    <span className={styles.verifiedBadge}>
                      <FaCheckCircle />
                      Paid
                    </span>
                  </div>

                  <div className={styles.cardBody}>
                    <p>
                      <strong>Transaction:</strong>{" "}
                      {receipt?.transactionId || "-"}
                    </p>

                    <p>
                      <strong>Note:</strong> {receipt?.note || "-"}
                    </p>
                  </div>

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
        )}
      </div>
    </div>
  );
};

export default AdminTransportPaymentsSection;
