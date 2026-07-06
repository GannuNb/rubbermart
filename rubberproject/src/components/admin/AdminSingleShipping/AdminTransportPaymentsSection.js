import React, { useState } from "react";
import {
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaFileInvoice,
  FaTruck,
  FaUpload,
  FaChevronDown,
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
      NESTED DROPDOWN ACCORDION STATES
  ========================= */
  const [isMainOpen, setIsMainOpen] = useState(true); 
  const [isFormOpen, setIsFormOpen] = useState(false); 
  const [isBuyerHistoryOpen, setIsBuyerHistoryOpen] = useState(true); 
  const [isTransporterHistoryOpen, setIsTransporterHistoryOpen] = useState(true); 

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
      {/* MAIN COMPONENT HEADER */}
      <div 
        className={styles.header} 
        onClick={() => setIsMainOpen(!isMainOpen)} 
        style={{ cursor: "pointer", userSelect: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <FaMoneyBillWave className={styles.headerIcon} />
          <div>
            <h2>Transport Payments</h2>
            <p>Buyer receipts & transporter payments</p>
          </div>
        </div>
        <span className={`${styles.toggleIcon} ${isMainOpen ? styles.iconActive : ""}`} style={{ fontSize: "24px", fontWeight: "700", color: "#6d28d9", transition: "transform 0.2s" }}>
          {isMainOpen ? "−" : "+"}
        </span>
      </div>

      {/* DROPDOWN INNER CONTENT CONTAINER */}
      {isMainOpen && (
        <div className={styles.dropdownContent} style={{ marginTop: "24px" }}>
          
          {/* SUMMARY GRID */}
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

          {/* ACCORDION: TRANSPORTER FORM */}
          <div className={styles.formCard} style={{ padding: "0" }}>
            <div 
              className={styles.formHeader} 
              onClick={() => setIsFormOpen(!isFormOpen)}
              style={{ cursor: "pointer", userSelect: "none", padding: "24px", margin: "0", display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <FaTruck style={{ color: "#6d28d9", fontSize: "20px" }} />
                <h3>Pay Transporter</h3>
              </div>
              <FaChevronDown style={{ transform: isFormOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", color: "#6d28d9" }} />
            </div>

            {isFormOpen && (
              <div style={{ padding: "0 24px 24px 24px" }}>
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
                  {adminTransportPaymentLoading ? "Uploading..." : "Upload Transporter Payment"}
                </button>
              </div>
            )}
          </div>

          {/* SIDE BY SIDE GRID CONTAINER FOR HISTORY SECTIONS */}
          <div className={styles.sideBySideHistoryGrid}>
            
            {/* COLUMN 1: BUYER PAYMENTS */}
            <div className={styles.historyColumn}>
              <div 
                onClick={() => setIsBuyerHistoryOpen(!isBuyerHistoryOpen)}
                className={styles.historySectionHeader}
              >
                <h3 className={styles.sectionTitle}>Buyer Payment History</h3>
                <FaChevronDown style={{ transform: isBuyerHistoryOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", color: "#111827", fontSize: "16px" }} />
              </div>

              {isBuyerHistoryOpen && (
                <div className={styles.stackCardsContainer}>
                  {buyerPayments.length === 0 ? (
                    <div className={styles.emptyBox}>No buyer payments recorded</div>
                  ) : (
                    buyerPayments
                      .slice()
                      .reverse()
                      .map((receipt) => (
                        <div key={receipt?._id} className={styles.cleanPaymentCard}>
                          <div className={styles.cleanCardHeader}>
                            <div>
                              <span className={styles.cleanCardSubtitle}>Amount Paid</span>
                              <h3 className={styles.cleanCardPrice}>
                                ₹ {Number(receipt?.amount || 0).toLocaleString("en-IN")}
                              </h3>
                            </div>

                            {receipt?.status === "verified" ? (
                              <span className={styles.verifiedBadge}><FaCheckCircle /> Verified</span>
                            ) : receipt?.status === "rejected" ? (
                              <span className={styles.rejectedBadge}><FaTimesCircle /> Rejected</span>
                            ) : (
                              <span className={styles.pendingBadge}><FaClock /> Pending</span>
                            )}
                          </div>

                          <div className={styles.cleanCardDetailsList}>
                            <div className={styles.cleanDetailItem}>
                              <span className={styles.detailLabel}>Mode:</span>
                              <span className={styles.detailValue}>{receipt?.paymentMode?.replace('_', ' ')}</span>
                            </div>
                            <div className={styles.cleanDetailItem}>
                              <span className={styles.detailLabel}>TXN ID:</span>
                              <span className={styles.detailValue}>{receipt?.transactionId || "—"}</span>
                            </div>
                            {receipt?.note && (
                              <div className={styles.cleanDetailItemFull}>
                                <span className={styles.detailLabel}>Admin Note:</span>
                                <span className={styles.detailValueNote}>{receipt?.note}</span>
                              </div>
                            )}
                          </div>

                          <div className={styles.cleanCardActionsContainer}>
                            {receipt?.file?.data && (
                              <button
                                className={styles.cleanReceiptBtn}
                                onClick={() => handleOpenReceipt(receipt.file)}
                              >
                                <FaFileInvoice /> View Receipt
                              </button>
                            )}

                            {receipt?.status === "pending" && (
                              <div className={styles.cleanActionsRow}>
                                <button
                                  className={styles.cleanVerifyBtn}
                                  onClick={() => handleAction(receipt._id, "verified")}
                                >
                                  Approve
                                </button>
                                <button
                                  className={styles.cleanRejectBtn}
                                  onClick={() => handleAction(receipt._id, "rejected")}
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                  )}
                </div>
              )}
            </div>

            {/* COLUMN 2: TRANSPORTER PAYMENTS */}
            <div className={styles.historyColumn}>
              <div 
                onClick={() => setIsTransporterHistoryOpen(!isTransporterHistoryOpen)}
                className={styles.historySectionHeader}
              >
                <h3 className={styles.sectionTitle}>Transporter Payment History</h3>
                <FaChevronDown style={{ transform: isTransporterHistoryOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", color: "#111827", fontSize: "16px" }} />
              </div>

              {isTransporterHistoryOpen && (
                <div className={styles.stackCardsContainer}>
                  {transporterPayments.length === 0 ? (
                    <div className={styles.emptyBox}>No transporter payments recorded</div>
                  ) : (
                    transporterPayments
                      .slice()
                      .reverse()
                      .map((receipt) => (
                        <div key={receipt?._id} className={styles.cleanPaymentCard}>
                          <div className={styles.cleanCardHeader}>
                            <div>
                              <span className={styles.cleanCardSubtitle}>Disbursed Amount</span>
                              <h3 className={styles.cleanCardPrice} style={{ color: "#059669" }}>
                                ₹ {Number(receipt?.amount || 0).toLocaleString("en-IN")}
                              </h3>
                            </div>
                            <span className={styles.verifiedBadge}><FaCheckCircle /> Paid Out</span>
                          </div>

                          <div className={styles.cleanCardDetailsList}>
                            <div className={styles.cleanDetailItem}>
                              <span className={styles.detailLabel}>Mode:</span>
                              <span className={styles.detailValue}>{receipt?.paymentMode?.replace('_', ' ')}</span>
                            </div>
                            <div className={styles.cleanDetailItem}>
                              <span className={styles.detailLabel}>Reference ID:</span>
                              <span className={styles.detailValue}>{receipt?.transactionId || "—"}</span>
                            </div>
                            {receipt?.note && (
                              <div className={styles.cleanDetailItemFull}>
                                <span className={styles.detailLabel}>Note:</span>
                                <span className={styles.detailValueNote}>{receipt?.note}</span>
                              </div>
                            )}
                          </div>

                          {receipt?.file?.data && (
                            <div className={styles.cleanCardActionsContainer}>
                              <button
                                className={styles.cleanReceiptBtn}
                                onClick={() => handleOpenReceipt(receipt.file)}
                              >
                                <FaFileInvoice /> View Record Link
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                  )}
                </div>
              )}
            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default AdminTransportPaymentsSection;