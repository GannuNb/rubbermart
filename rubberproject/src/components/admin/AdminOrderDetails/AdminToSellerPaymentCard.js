// src/components/admin/AdminOrderDetails/AdminToSellerPaymentCard.js

import React, { useState } from "react";
import {
  FaWallet,
  FaUpload,
  FaCheckCircle,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

import { uploadAdminToSellerPayment } from "../../../redux/slices/adminOrders/uploadAdminToSellerPaymentThunk";

import styles from "../../../styles/Admin/AdminToSellerPaymentCard.module.css";

const AdminToSellerPaymentCard = ({ order }) => {
  const dispatch = useDispatch();

  const {
    uploadSellerPaymentLoading,
  } = useSelector(
    (state) => state.adminOrders
  );

  const [amount, setAmount] =
    useState("");

  const [paymentMode, setPaymentMode] =
    useState("bank_transfer");

  const [
    transactionId,
    setTransactionId,
  ] = useState("");

  const [note, setNote] =
    useState("");

  const [file, setFile] =
    useState(null);

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  /* =========================
     SUBMIT PAYMENT
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount) {
      alert("Please enter amount");
      return;
    }

    try {
      await dispatch(
        uploadAdminToSellerPayment({
          orderId: order?._id,
          amount,
          paymentMode,
          transactionId,
          note,
          file,
        })
      ).unwrap();

      /* success message */
      setSuccessMessage(
        "Payment sent to seller successfully"
      );

      /* reset form */
      setAmount("");
      setPaymentMode(
        "bank_transfer"
      );
      setTransactionId("");
      setNote("");
      setFile(null);

      /* auto remove after 4 sec */
      setTimeout(() => {
        setSuccessMessage("");
      }, 4000);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  return (
    <div className={styles.card}>
      {/* HEADER */}
      <div className={styles.cardHeader}>
        <div className={styles.iconBox}>
          <FaWallet />
        </div>

        <h3>
          Payment To Seller
        </h3>
      </div>

      {/* SUCCESS MESSAGE */}
      {successMessage && (
        <div className={styles.successBox}>
          <FaCheckCircle />
          <span>
            {successMessage}
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Amount */}
        <div className={styles.formGroup}>
          <label>
            Amount
          </label>

          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) =>
              setAmount(
                e.target.value
              )
            }
          />
        </div>

        {/* Payment Mode */}
        <div className={styles.formGroup}>
          <label>
            Payment Mode
          </label>

          <select
            value={paymentMode}
            onChange={(e) =>
              setPaymentMode(
                e.target.value
              )
            }
          >
            <option value="bank_transfer">
              Bank Transfer
            </option>
            <option value="upi">
              UPI
            </option>
            <option value="cash">
              Cash
            </option>
            <option value="cheque">
              Cheque
            </option>
            <option value="rtgs">
              RTGS
            </option>
            <option value="neft">
              NEFT
            </option>
          </select>
        </div>

        {/* Transaction ID */}
        <div className={styles.formGroup}>
          <label>
            Transaction ID
          </label>

          <input
            type="text"
            placeholder="Enter transaction ID"
            value={transactionId}
            onChange={(e) =>
              setTransactionId(
                e.target.value
              )
            }
          />
        </div>

        {/* Note */}
        <div className={styles.formGroup}>
          <label>
            Note
          </label>

          <textarea
            rows="3"
            placeholder="Optional note"
            value={note}
            onChange={(e) =>
              setNote(
                e.target.value
              )
            }
          />
        </div>

        {/* Upload Receipt */}
        <div className={styles.formGroup}>
          <label>
            Upload Receipt
          </label>

          <label
            className={
              styles.uploadBox
            }
          >
            <FaUpload />

            <span>
              {file
                ? file.name
                : "Choose file"}
            </span>

            <input
              type="file"
              hidden
              onChange={(e) =>
                setFile(
                  e.target
                    .files[0]
                )
              }
            />
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={
            uploadSellerPaymentLoading
          }
        >
          {uploadSellerPaymentLoading
            ? "Submitting..."
            : "Submit Payment"}
        </button>
      </form>
    </div>
  );
};

export default AdminToSellerPaymentCard;