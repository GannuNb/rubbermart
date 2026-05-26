import React, { useState } from "react";
import styles from "../../styles/Buyer/BuyerOrderDetails.module.css";
import CustomAlert from "../alert/CustomAlert";
function PaymentUploadCard({ order, onPaymentUploaded }) {
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("bank_transfer");
  const [transactionId, setTransactionId] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    type: "",
    title: "",
    message: "",
  });
  const handleSubmit = async () => {
    if (!amount || !file) {
      setAlert({
        show: true,
        type: "warning",
        title: "Missing Information",
        message: "Amount and receipt file are required",
      });

      return;
    }

    // ✅ calculate remaining from VERIFIED ONLY
    const verifiedPaid = (order.buyerPaymentReceipts || [])
      .filter((r) => r.status === "verified")
      .reduce((sum, r) => sum + Number(r.amount || 0), 0);

    const remaining = order.totalAmount - verifiedPaid;

    if (Number(amount) > remaining) {
      setAlert({
        show: true,
        type: "warning",
        title: "Invalid Amount",
        message: "Amount exceeds remaining amount",
      });

      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("amount", amount);
      formData.append("paymentMode", paymentMode);
      formData.append("transactionId", transactionId);
      formData.append("note", note);
      formData.append("file", file);
      formData.append("paymentFor", "buyer_to_admin");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/orders/buyer-orders/${order._id}/payment`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setAlert({
          show: true,
          type: "success",
          title: "Payment Uploaded",
          message: "Payment uploaded and is pending approval",
        });
        onPaymentUploaded();

        setAmount("");
        setTransactionId("");
        setNote("");
        setFile(null);
      } else {
        setAlert({
          show: true,
          type: "error",
          title: "Upload Failed",
          message: data.message || "Upload failed",
        });
      }
    } catch (error) {
      console.log(error);
      setAlert({
        show: true,
        type: "error",
        title: "Error",
        message: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.paymentCard}>
      {alert.show && (
        <CustomAlert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() =>
            setAlert((prev) => ({
              ...prev,
              show: false,
            }))
          }
        />
      )}
      <h3 className={styles.cardTitle}>Upload Payment</h3>

      <div className={styles.formGroup}>
        <label>Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
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

      <div className={styles.formGroup}>
        <label>Transaction ID</label>
        <input
          type="text"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Note</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Upload Receipt</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      <button
        className={styles.submitBtn}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Submit Payment"}
      </button>
    </div>
  );
}

export default PaymentUploadCard;