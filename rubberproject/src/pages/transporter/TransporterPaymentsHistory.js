import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaTruck,
  FaCheckCircle,
  FaFileInvoice,
} from "react-icons/fa";
import { getTransporterPaymentHistoryThunk } from "../../redux/slices/transporter/getTransporterPaymentHistoryThunk";
import { downloadTransporterPaymentHistoryPdfThunk } from "../../redux/slices/transporter/downloadTransporterPaymentHistoryPdfThunk";
import styles from "./TransporterPaymentsHistory.module.css";

const TransporterPaymentsHistory = () => {
  const dispatch = useDispatch();
  const {
    paymentHistory,
    paymentHistoryLoading,
    paymentHistoryError,
  } = useSelector((state) => state.transporter);

  useEffect(() => {
    dispatch(getTransporterPaymentHistoryThunk());
  }, [dispatch]);

const handleDownloadPaymentReport = async () => {
  try {
    await dispatch(
      downloadTransporterPaymentHistoryPdfThunk(),
    );
  } catch (error) {
    console.error(
      "Download Payment Report Error:",
      error,
    );

    alert(
      "Failed to download payment report",
    );
  }
};

  const handleOpenReceipt = (file) => {
    try {
      if (!file?.data) {
        return alert("Receipt not found");
      }

      const byteArray = file.data.data;

      const uint8Array =
        new Uint8Array(byteArray);

      const blob = new Blob(
        [uint8Array],
        {
          type:
            file.contentType ||
            "application/pdf",
        },
      );

      const fileURL =
        window.URL.createObjectURL(blob);

      window.open(
        fileURL,
        "_blank",
      );
    } catch (error) {
      console.log(error);

      alert(
        "Failed to open receipt",
      );
    }
  };

  const history = Array.isArray(
    paymentHistory,
  )
    ? paymentHistory
    : [];

  const totalTransportAmount =
    history.reduce(
      (sum, shipment) =>
        sum +
        Number(
          shipment?.transportAmount || 0,
        ),
      0,
    );

  const totalReceived =
    history.reduce(
      (sum, shipment) =>
        sum +
        Number(
          shipment?.totalReceived || 0,
        ),
      0,
    );

  const totalRemaining =
    history.reduce(
      (sum, shipment) =>
        sum +
        Number(
          shipment?.remainingAmount || 0,
        ),
      0,
    );

  if (paymentHistoryLoading) {
    return (
      <div className={styles.container}>
        Loading payments...
      </div>
    );
  }

  if (paymentHistoryError) {
    return (
      <div className={styles.container}>
        {paymentHistoryError}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h1>Payment History</h1>
          <p>
            Track all transporter payments
          </p>
        </div>

        <div
          className={
            styles.headerActions
          }
        >
          <button
            type="button"
            className={
              styles.downloadPaymentReportButton
            }
            onClick={
              handleDownloadPaymentReport
            }
          >
            <span
              className={
                styles.downloadPaymentReportIcon
              }
            >
              ↓
            </span>
            Download Payment Report
          </button>
        </div>
      </div>

      {/* SUMMARY */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <p>Total Transport</p>
          <h3>
            ₹{" "}
            {totalTransportAmount.toLocaleString(
              "en-IN",
            )}
          </h3>
        </div>

        <div className={styles.summaryCard}>
          <p>Total Received</p>
          <h3>
            ₹{" "}
            {totalReceived.toLocaleString(
              "en-IN",
            )}
          </h3>
        </div>

        <div className={styles.summaryCard}>
          <p>Remaining Amount</p>
          <h3>
            ₹{" "}
            {totalRemaining.toLocaleString(
              "en-IN",
            )}
          </h3>
        </div>
      </div>

      {/* EMPTY */}
      {history.length === 0 ? (
        <div className={styles.emptyBox}>
          No payment history found
        </div>
      ) : (
        <div className={styles.shipmentsGrid}>
          {history.map((shipment) => (
            <div
              key={shipment.shipmentId}
              className={
                styles.shipmentCard
              }
            >
              {/* TOP */}
              <div
                className={styles.cardTop}
              >
                <div>
                  <h2>
                    {shipment.selectedItem}
                  </h2>

                  <p>
                    Invoice :{" "}
                    {
                      shipment.shipmentInvoiceId
                    }
                  </p>
                </div>

                <FaTruck
                  className={
                    styles.truckIcon
                  }
                />
              </div>

              {/* INFO */}
              <div
                className={styles.infoGrid}
              >
                <div>
                  <span>Buyer</span>
                  <h4>
                    {shipment.buyer}
                  </h4>
                </div>

                <div>
                  <span>Seller</span>
                  <h4>
                    {shipment.seller}
                  </h4>
                </div>

                <div>
                  <span>Total</span>
                  <h4>
                    ₹{" "}
                    {Number(
                      shipment.transportAmount ||
                        0,
                    ).toLocaleString(
                      "en-IN",
                    )}
                  </h4>
                </div>

                <div>
                  <span>Received</span>
                  <h4
                    className={
                      styles.greenText
                    }
                  >
                    ₹{" "}
                    {Number(
                      shipment.totalReceived ||
                        0,
                    ).toLocaleString(
                      "en-IN",
                    )}
                  </h4>
                </div>

                <div>
                  <span>Remaining</span>
                  <h4
                    className={
                      styles.orangeText
                    }
                  >
                    ₹{" "}
                    {Number(
                      shipment.remainingAmount ||
                        0,
                    ).toLocaleString(
                      "en-IN",
                    )}
                  </h4>
                </div>

                <div>
                  <span>Shipment</span>
                  <h4>
                    {
                      shipment.shipmentStatus
                    }
                  </h4>
                </div>
              </div>

              {/* PAYMENTS */}
              <div
                className={
                  styles.paymentsSection
                }
              >
                <h3>
                  Payment History
                </h3>

                {!Array.isArray(
                  shipment?.payments,
                ) ||
                shipment.payments.length ===
                  0 ? (
                  <div
                    className={
                      styles.noPayments
                    }
                  >
                    No payments received
                  </div>
                ) : (
                  shipment.payments.map(
                    (payment) => (
                      <div
                        key={payment._id}
                        className={
                          styles.paymentCard
                        }
                      >
                        <div
                          className={
                            styles.paymentTop
                          }
                        >
                          <div>
                            <h4>
                              ₹{" "}
                              {Number(
                                payment.amount ||
                                  0,
                              ).toLocaleString(
                                "en-IN",
                              )}
                            </h4>

                            <p>
                              {
                                payment.paymentMode
                              }
                            </p>
                          </div>

                          <span
                            className={
                              styles.verifiedBadge
                            }
                          >
                            <FaCheckCircle />
                            Verified
                          </span>
                        </div>

                        <div
                          className={
                            styles.paymentBody
                          }
                        >
                          <p>
                            <strong>
                              Transaction:
                            </strong>{" "}
                            {payment.transactionId ||
                              "-"}
                          </p>

                          <p>
                            <strong>
                              Note:
                            </strong>{" "}
                            {payment.note ||
                              "-"}
                          </p>

                          <p>
                            <strong>
                              Date:
                            </strong>{" "}
                            {payment.createdAt
                              ? new Date(
                                  payment.createdAt,
                                ).toLocaleString()
                              : "-"}
                          </p>
                        </div>

                        {payment?.file
                          ?.data && (
                          <button
                            type="button"
                            className={
                              styles.receiptBtn
                            }
                            onClick={() =>
                              handleOpenReceipt(
                                payment.file,
                              )
                            }
                          >
                            <FaFileInvoice />
                            View Receipt
                          </button>
                        )}
                      </div>
                    ),
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransporterPaymentsHistory;