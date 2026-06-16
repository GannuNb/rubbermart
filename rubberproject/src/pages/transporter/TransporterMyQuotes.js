import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getTransporterQuotesThunk } from "../../redux/slices/transporter/transporterThunk";

import styles from "./TransporterMyQuotes.module.css";

const TransporterMyQuotes = () => {
  const dispatch = useDispatch();

  const { myQuotes, myQuotesLoading, myQuotesError } = useSelector(
    (state) => state.transporter,
  );

  /* =========================
     FETCH
  ========================= */

  useEffect(() => {
    dispatch(getTransporterQuotesThunk());
  }, [dispatch]);

  /* =========================
     LOADING
  ========================= */

  if (myQuotesLoading) {
    return <div className={styles.container}>Loading quotes...</div>;
  }

  /* =========================
     ERROR
  ========================= */

  if (myQuotesError) {
    return <div className={styles.container}>{myQuotesError}</div>;
  }

  return (
    <div className={styles.container}>
      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="mb-4">
        <h2 className={styles.title}>My Quotes</h2>

        <p className={styles.subtitle}>
          View all quotes you have submitted for shipments.
        </p>
      </div>

      {/* =========================
          EMPTY
      ========================= */}

      {!myQuotes || myQuotes.length === 0 ? (
        <div className="alert alert-secondary border-0 shadow-sm text-center py-4">
          No quotes submitted yet
        </div>
      ) : (
        <div className={`card ${styles.tableCard}`}>
          <div className="table-responsive">
            <table
              className={`table align-middle mb-0 ${styles.tableMinWidth}`}
            >
              {/* =========================
                  TABLE HEADER
              ========================= */}

              <thead className={styles.tableHeader}>
                <tr>
                  <th className={styles.thText} style={{ width: "18%" }}>
                    Shipment
                  </th>

                  <th className={styles.thText} style={{ width: "15%" }}>
                    Route
                  </th>

                  <th className={styles.thText} style={{ width: "18%" }}>
                    Package
                  </th>

                  <th className={styles.thText} style={{ width: "12%" }}>
                    Packed On
                  </th>

                  <th className={styles.thText} style={{ width: "20%" }}>
                    Your Quote
                  </th>

                  <th className={styles.thText} style={{ width: "17%" }}>
                    Status
                  </th>
                </tr>
              </thead>

              {/* =========================
                  TABLE BODY
              ========================= */}

              <tbody style={{ borderTop: "none" }}>
                {myQuotes.map((quote) => {
                  const shipment = quote?.shipment;

                  return (
                    <tr key={quote._id} className={styles.rowBorder}>
                      {/* =========================
                          SHIPMENT DETAILS
                      ========================= */}

                      <td className="px-4 py-4">
                        <div className="d-flex align-items-start gap-2">
                          <div className={styles.iconBoxLarge}>
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#9333ea"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>

                              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>

                              <line x1="12" y1="22.08" x2="12" y2="12"></line>
                            </svg>
                          </div>

                          <div>
                            <div className={styles.orderId}>
                              Order : {quote?.orderInvoiceId || "N/A"}
                            </div>

                            <div className={styles.invoiceId}>
                              Shipment : {shipment?.shipmentInvoiceId || "N/A"}
                            </div>

                            <span className={styles.statusBadge}>✓ Packed</span>
                          </div>
                        </div>
                      </td>

                      {/* =========================
                          ROUTE
                      ========================= */}

                      <td className="px-3 py-4">
                        <div className={styles.routeTimeline}>
                          <div className={styles.timelineGraphics}>
                            <div className={styles.circleTop}></div>

                            <div className={styles.dashedLine}></div>

                            <div className={styles.circleBottom}></div>
                          </div>

                          <div className="mb-3">
                            <span className={styles.routeLabel}>From</span>

                            <span className={styles.routeText}>
                              {shipment?.shipmentFrom || "N/A"}
                            </span>
                          </div>

                          <div>
                            <span className={styles.routeLabel}>To</span>

                            <span className={styles.routeText}>
                              {shipment?.shipmentTo || "N/A"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* =========================
                          PACKAGE DETAILS
                      ========================= */}

                      <td className="px-3 py-4">
                        <div className="d-flex align-items-start gap-2">
                          <div className={styles.iconBoxSmall}>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#9333ea"
                              strokeWidth="2"
                            >
                              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                          </div>

                          <div>
                            <div className={styles.packageText}>
                              <strong>Item:</strong>{" "}
                              {shipment?.selectedItem || "N/A"}
                            </div>

                            <div className={styles.packageSubText}>
                              <strong>Quantity:</strong>{" "}
                              {shipment?.shippedQuantity || 0} MT
                            </div>

                            <div className={styles.hsnText}>
                              HSN : {shipment?.transportHSNCode || "9965"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* =========================
                          PACKED ON
                      ========================= */}

                      <td className="px-3 py-4">
                        {shipment?.packedAt ? (
                          <>
                            <div className={styles.dateText}>
                              {new Date(shipment.packedAt).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </div>

                            <div className={styles.timeText}>
                              {new Date(shipment.packedAt).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                },
                              )}
                            </div>
                          </>
                        ) : (
                          "-"
                        )}
                      </td>

                      {/* =========================
                          YOUR QUOTE
                      ========================= */}

                      <td className="px-3 py-4">
                        <div className={styles.quoteBoxWrapper}>
                          <div className={styles.quoteRowItem}>
                            <span className={styles.quoteLabelText}>Price</span>

                            <span className={styles.quoteValueTextPurple}>
                              ₹{" "}
                              {Number(quote?.quotedPrice || 0).toLocaleString(
                                "en-IN",
                              )}
                            </span>
                          </div>

                          <div className={styles.quoteRowItem}>
                            <span className={styles.quoteLabelText}>
                              Delivery
                            </span>

                            <span className={styles.quoteValueText}>
                              {quote?.estimatedDeliveryDays || 0} Days
                            </span>
                          </div>

                          <div className={styles.quoteRowItem}>
                            <span className={styles.quoteLabelText}>Note</span>

                            <span className={styles.quoteNoteText}>
                              {quote?.note || "No note"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* =========================
                          STATUS
                      ========================= */}

                      <td className="px-3 py-4">
                        {quote?.quoteStatus === "selected" ? (
                          <span className={styles.badgeAccepted}>
                            Quote Accepted
                          </span>
                        ) : quote?.quoteStatus === "rejected" ? (
                          <span className={styles.badgeRejected}>
                            Not Selected
                          </span>
                        ) : (
                          <span className={styles.badgeUnderReview}>
                            Under Review
                          </span>
                        )}

                        <div
                          style={{
                            marginTop: "10px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "0.72rem",
                              color: "#6b7280",
                            }}
                          >
                            Submitted On
                          </div>

                          <div
                            style={{
                              fontWeight: "600",
                              fontSize: "0.8rem",
                            }}
                          >
                            {quote?.submittedAt
                              ? new Date(quote.submittedAt).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )
                              : "-"}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
export default TransporterMyQuotes;
