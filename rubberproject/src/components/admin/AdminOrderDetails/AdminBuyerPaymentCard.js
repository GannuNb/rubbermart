// src/components/admin/AdminOrderDetails/AdminBuyerPaymentCard.js

import React, { useState } from "react";
import {
  FaDownload,
  FaCheckCircle,
} from "react-icons/fa";
import { useDispatch } from "react-redux";

import { approveBuyerPayment } from "../../../redux/slices/adminOrders/approveBuyerPaymentThunk";

import styles from "../../../styles/Admin/AdminBuyerPaymentCard.module.css";

const AdminBuyerPaymentCard = ({ order }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [openPayment, setOpenPayment] =
    useState(null);
  const dispatch = useDispatch();

  const payments =
    order?.buyerPaymentReceipts || [];

  /* =========================
     ONLY CURRENT BUTTON LOADING
  ========================= */

  const [
    approvingPaymentId,
    setApprovingPaymentId,
  ] = useState(null);

  /* =========================
     VIEW RECEIPT
  ========================= */

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
      console.log(
        "View Receipt Error:",
        error
      );
      alert("Failed to open receipt");
    }
  };

  /* =========================
     APPROVE PAYMENT
  ========================= */

  const handleApprovePayment = async (
    paymentId
  ) => {
    if (!paymentId) return;

    try {
      setApprovingPaymentId(paymentId);

      await dispatch(
        approveBuyerPayment({
          orderId: order?._id,
          paymentId,
        })
      ).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      setApprovingPaymentId(null);
    }
  };

  return (
    <div className={styles.card}>
      <div
        className={styles.dropdownHeader}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.headerLeft}>
          <div className={styles.iconBox}>
            <FaDownload />
          </div>

          <h3>
            Payment From Buyer (Received)
          </h3>
        </div>

        <span
          className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ""
            }`}
        >
          ▼
        </span>
      </div>

      {isOpen && (
        <>
          {payments.length > 0 ? (
            payments.map((payment, index) => (
              <div
                key={payment._id || index}
                className={styles.paymentBox}
              >
                <div
                  className={styles.paymentDropdownHeader}
                  onClick={() =>
                    setOpenPayment(
                      openPayment === payment._id
                        ? null
                        : payment._id
                    )
                  }
                >
                  <span>
                    Payment #{index + 1}
                  </span>

                  <span
                    className={`${styles.arrowSmall} ${openPayment === payment._id
                      ? styles.arrowOpen
                      : ""
                      }`}
                  >
                    ▼
                  </span>
                </div>

                {openPayment === payment._id && (
                  <>
                    <div className={styles.paymentTitle}>
                    </div>

                    <div className={styles.details}>
                      <div className={styles.row}>
                        <span>Amount</span>
                        <strong>
                          ₹ {payment?.amount || 0}
                        </strong>
                      </div>

                      <div className={styles.row}>
                        <span>Payment Method</span>
                        <strong>
                          {payment?.paymentMode || "-"}
                        </strong>
                      </div>

                      <div className={styles.row}>
                        <span>Transaction ID</span>
                        <strong>
                          {payment?.transactionId ||
                            "-"}
                        </strong>
                      </div>

                      <div className={styles.row}>
                        <span>Status</span>
                        <strong>
                          {payment?.status || "-"}
                        </strong>
                      </div>

                      <div className={styles.row}>
                        <span>Note</span>
                        <strong>
                          {payment?.note || "-"}
                        </strong>
                      </div>
                    </div>

                    <div className={styles.buttonRow}>
                      <button
                        className={styles.lightBtn}
                        onClick={() =>
                          handleViewReceipt(
                            payment?.file
                          )
                        }
                      >
                        View Receipt
                      </button>

                      {payment?.status ===
                        "verified" ? (
                        <button
                          className={
                            styles.approvedBtn
                          }
                        >
                          Approved
                        </button>
                      ) : (
                        <button
                          className={
                            styles.primaryBtn
                          }
                          onClick={() =>
                            handleApprovePayment(
                              payment?._id
                            )
                          }
                          disabled={
                            approvingPaymentId ===
                            payment?._id
                          }
                        >
                          <FaCheckCircle />

                          {approvingPaymentId ===
                            payment?._id
                            ? "Approving..."
                            : "Approve Payment"}
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            <p className={styles.emptyText}>
              No buyer payments uploaded yet
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default AdminBuyerPaymentCard;