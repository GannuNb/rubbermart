import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTransporterQuotesThunk } from "../../redux/slices/transporter/transporterThunk";
import styles from "./TransporterMyQuotes.module.css";

function TransporterMyQuotes() {
  const dispatch = useDispatch();

  const {
    myQuotes,
    myQuotesLoading,
    myQuotesError,
  } = useSelector((state) => state.transporter);

  useEffect(() => {
    dispatch(getTransporterQuotesThunk());
  }, [dispatch]);

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
          LOADING / ERROR / EMPTY STATES
      ========================= */}
      {myQuotesLoading && (
        <div className="alert alert-info border-0 shadow-sm">Loading quotes...</div>
      )}

      {myQuotesError && (
        <div className="alert alert-danger border-0 shadow-sm">{myQuotesError}</div>
      )}

      {!myQuotesLoading && myQuotes.length === 0 && (
        <div className="alert alert-secondary border-0 shadow-sm text-center py-4">
          No quotes submitted yet
        </div>
      )}

      {/* =========================
          QUOTES DATA TABLE
      ========================= */}
      {!myQuotesLoading && myQuotes.length > 0 && (
        <div className={`card ${styles.tableCard}`}>
          <div className="table-responsive">
            <table className={`table align-middle mb-0 ${styles.tableMinWidth}`}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th className={styles.thText} style={{ width: "18%" }}>Shipment Details</th>
                  <th className={styles.thText} style={{ width: "15%" }}>Route</th>
                  <th className={styles.thText} style={{ width: "18%" }}>Package Details</th>
                  <th className={styles.thText} style={{ width: "12%" }}>Packed On</th>
                  <th className={styles.thText} style={{ width: "22%" }}>Your Quote</th>
                  <th className={styles.thText} style={{ width: "15%" }}>Status</th>
                </tr>
              </thead>
              <tbody style={{ borderTop: "none" }}>
                {myQuotes.map((quote) => {
                  const targetShipment = quote.orderId?.shipments?.find(
                    (shipment) => shipment._id?.toString() === quote.shipmentId?.toString()
                  );

                  return (
                    <tr key={quote._id} className={styles.rowBorder}>
                      {/* SHIPMENT DETAILS */}
                      <td className="px-4 py-4">
                        <div className="d-flex align-items-start gap-2">
                          <div className={styles.iconBoxLarge}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                              <line x1="12" y1="22.08" x2="12" y2="12"></line>
                            </svg>
                          </div>
                          <div>
                            <div className={styles.orderId}>
                              Order ID: {quote.orderId?.orderId || "N/A"}
                            </div>
                            <div className={styles.invoiceId}>
                              Invoice ID: {targetShipment?.shipmentInvoiceId || "N/A"}
                            </div>
                            <span className={styles.statusBadge}>
                              ✓ Packed
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* ROUTE */}
                      <td className="px-3 py-4">
                        <div className={styles.routeTimeline}>
                          <div className={styles.timelineGraphics}>
                            <div className={styles.circleTop}></div>
                            <div className={styles.dashedLine}></div>
                            <div className={styles.circleBottom}></div>
                          </div>
                          <div className="mb-3">
                            <span className={styles.routeLabel}>From: Ex</span>
                            <span className={styles.routeText}>{targetShipment?.shipmentFrom || "N/A"}</span>
                          </div>
                          <div>
                            <span className={styles.routeLabel}>To:</span>
                            <span className={styles.routeText}>{targetShipment?.shipmentTo || "N/A"}</span>
                          </div>
                        </div>
                      </td>

                      {/* PACKAGE DETAILS */}
                      <td className="px-3 py-4">
                        <div className="d-flex align-items-start gap-2">
                          <div className={styles.iconBoxSmall}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2">
                              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                            </svg>
                          </div>
                          <div>
                            <div className={styles.packageText}>
                              <strong className="fw-semibold">Item:</strong> {targetShipment?.selectedItem || "N/A"}
                            </div>
                            <div className={styles.packageSubText}>
                              <strong className="fw-semibold">Quantity:</strong> {targetShipment?.shippedQuantity} MT
                            </div>
                            <div className={styles.hsnText}>
                              Transport HSN: {targetShipment?.transportHSNCode || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* PACKED ON */}
                      <td className="px-3 py-4">
                        <div className="d-flex align-items-start gap-2">
                          <div className={styles.iconBoxSmall}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                              <line x1="16" y1="2" x2="16" y2="6"></line>
                              <line x1="8" y1="2" x2="8" y2="6"></line>
                              <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                          </div>
                          <div>
                            {targetShipment?.createdAt ? (
                              <>
                                <div className={styles.dateText}>
                                  {new Date(targetShipment.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </  div>
                                <div className={styles.timeText}>
                                  {new Date(targetShipment.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                </div>
                              </>
                            ) : (
                              <div className="text-muted">—</div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* YOUR QUOTE */}
                      <td className="px-3 py-4">
                        <div className={styles.quoteGrid}>
                          <div className={styles.quoteRowItem}>
                            <div className={styles.iconBoxSmall} style={{ width: "24px", height: "24px" }}>
                              <span style={{ fontSize: "0.75rem", color: "#9333ea", fontWeight: "600" }}>₹</span>
                            </div>
                            <div>
                              <span className="text-muted small">Transport Price (₹): </span>
                              <span className={styles.quoteValueText}>₹{quote.quotedPrice?.toLocaleString('en-IN') || "0"}</span>
                            </div>
                          </div>

                          <div className={styles.quoteRowItem}>
                            <div className={styles.iconBoxSmall} style={{ width: "24px", height: "24px" }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2.5">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                              </svg>
                            </div>
                            <div>
                              <span className="text-muted small">Delivery Days: </span>
                              <span className={styles.quoteValueText}>{quote.estimatedDeliveryDays} Days</span>
                            </div>
                          </div>

                          <div className={styles.quoteRowItem}>
                            <div className={styles.iconBoxSmall} style={{ width: "24px", height: "24px" }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2.5">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                              </svg>
                            </div>
                            <div className="text-truncate" style={{ maxWidth: "200px" }}>
                              <span className="text-muted small">Additional Notes: </span>
                              <span className={styles.quoteValueText} title={quote.note || "No note"}>
                                {quote.note || "—"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* STATUS CORRECTION SEGMENT */}
                      <td className="px-3 py-4">
                        <div className={styles.statusContainer}>
                          {quote.quoteStatus === "selected" ? (
                            <span className={styles.badgeAccepted}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                              Quote Accepted
                            </span>
                          ) : quote.quoteStatus === "rejected" ? (
                            <span className={styles.badgeRejected}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                              Not Selected
                            </span>
                          ) : (
                            <span className={styles.badgeUnderReview}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <circle cx="12" cy="12" r="10"></circle>
                              </svg>
                              Under Review
                            </span>
                          )}
                          
                          <div className={styles.submissionTimestamp}>
                            <div className="text-muted" style={{ fontSize: "0.7rem" }}>Submitted On</div>
                            <div className="fw-medium">
                              {quote.submittedAt ? new Date(quote.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "—"}
                            </div>
                            <div className="text-muted" style={{ fontSize: "0.7rem" }}>
                              {quote.submittedAt ? new Date(quote.submittedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : ""}
                            </div>
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
}

export default TransporterMyQuotes;