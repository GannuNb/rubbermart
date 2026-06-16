import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getOpenTransportShipmentsThunk,
  submitTransportQuoteThunk,
  getTransporterQuotesThunk,
} from "../../redux/slices/transporter/transporterThunk";
import styles from "./TransporterShipments.module.css";

function TransporterShipments() {
  const dispatch = useDispatch();

  const {
    openShipments,
    openShipmentsLoading,
    openShipmentsError,
    submitQuoteLoading,
    myQuotes,
  } = useSelector((state) => state.transporter);

  const [quoteData, setQuoteData] = useState({});
  const [activeShipmentId, setActiveShipmentId] = useState(null);

  /* =========================
     FETCH SHIPMENTS
  ========================= */
  useEffect(() => {
    dispatch(getOpenTransportShipmentsThunk());
    dispatch(getTransporterQuotesThunk());
  }, [dispatch]);

  /* =========================
     HANDLE INPUT CHANGE
  ========================= */
  const handleQuoteChange = (shipmentId, field, value) => {
    setQuoteData((prev) => ({
      ...prev,
      [shipmentId]: {
        ...prev[shipmentId],
        [field]: value,
      },
    }));
  };

  /* =========================
     SUBMIT QUOTE
  ========================= */
  const handleSubmitQuote = (item) => {
    const shipmentId = item.shipment._id;
    const quote = quoteData[shipmentId];

    if (!quote?.quotedPrice) {
      return alert("Please enter quote price");
    }

    setActiveShipmentId(shipmentId);

    dispatch(
      submitTransportQuoteThunk({
        orderId: item.orderId,
        shipmentId,
        quoteData: quote,
      }),
    ).then(() => {
      dispatch(getTransporterQuotesThunk());
      setActiveShipmentId(null);
    });
  };

  return (
    <div className={styles.container}>
      {/* =========================
          PAGE HEADER
      ========================= */}
      <div className="mb-4">
        <h2 className={styles.title}>Shipments</h2>
        <p className={styles.subtitle}>
          View all shipments packed by sellers and submit your transportation
          quote.
        </p>
      </div>

      {/* =========================
          LOADING / ERROR / EMPTY STATES
      ========================= */}
      {openShipmentsLoading && (
        <div className="alert alert-info border-0 shadow-sm">
          Loading shipments...
        </div>
      )}

      {openShipmentsError && (
        <div className="alert alert-danger border-0 shadow-sm">
          {openShipmentsError}
        </div>
      )}

      {!openShipmentsLoading && openShipments.length === 0 && (
        <div className="alert alert-secondary border-0 shadow-sm text-center py-4">
          No marketplace shipments available
        </div>
      )}

      {/* =========================
          SHIPMENTS TABLE
      ========================= */}
      {!openShipmentsLoading && openShipments.length > 0 && (
        <div className={`card ${styles.tableCard}`}>
          <div className="table-responsive">
            <table
              className={`table align-middle mb-0 ${styles.tableMinWidth}`}
            >
              <thead className={styles.tableHeader}>
                <tr>
                  <th className={styles.thText} style={{ width: "18%" }}>
                    Shipment Details
                  </th>
                  <th className={styles.thText} style={{ width: "15%" }}>
                    Route
                  </th>
                  <th className={styles.thText} style={{ width: "18%" }}>
                    Package Details
                  </th>
                  <th className={styles.thText} style={{ width: "12%" }}>
                    Packed On
                  </th>
                  <th className={styles.thText} style={{ width: "37%" }}>
                    Quote Submission
                  </th>
                </tr>
              </thead>
              <tbody style={{ borderTop: "none" }}>
                {openShipments.map((item) => {
                  const shipmentId = item.shipment?._id;
                  const alreadySubmitted = myQuotes.some(
                    (quote) =>
                      quote.shipmentId?.toString() === shipmentId?.toString(),
                  );

                  return (
                    <tr key={shipmentId} className={styles.rowBorder}>
                      {/* SHIPMENT DETAILS */}
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
                              Order ID: {item.orderInvoiceId || "N/A"}
                            </div>
                            <div className={styles.invoiceId}>
                              Invoice ID:{" "}
                              {item.shipment?.shipmentInvoiceId || "N/A"}
                            </div>
                            <span className={styles.statusBadge}>✓ Packed</span>
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
                            <span className={styles.routeLabel}>From: </span>
                            <span className={styles.routeText}>
                              {item.shipment?.shipmentFrom || "N/A"}
                            </span>
                          </div>
                          <div>
                            <span className={styles.routeLabel}>To:</span>
                            <span className={styles.routeText}>
                              {item.shipment?.shipmentTo || "N/A"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* PACKAGE DETAILS */}
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
                              <strong className="fw-semibold">Item:</strong>{" "}
                              {item.shipment?.selectedItem || "N/A"}
                            </div>
                            <div className={styles.packageSubText}>
                              <strong className="fw-semibold">Quantity:</strong>{" "}
                              {item.shipment?.shippedQuantity} MT
                            </div>
                            <div className={styles.hsnText}>
                              Transport HSN:{" "}
                              {item.shipment?.transportHSNCode || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* PACKED ON */}
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
                              <rect
                                x="3"
                                y="4"
                                width="18"
                                height="18"
                                rx="2"
                                ry="2"
                              ></rect>
                              <line x1="16" y1="2" x2="16" y2="6"></line>
                              <line x1="8" y1="2" x2="8" y2="6"></line>
                              <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                          </div>
                          <div>
                            {item.shipment?.createdAt ? (
                              <>
                                <div className={styles.dateText}>
                                  {new Date(
                                    item.shipment.createdAt,
                                  ).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </div>
                                <div className={styles.timeText}>
                                  {new Date(
                                    item.shipment.createdAt,
                                  ).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  })}
                                </div>
                              </>
                            ) : (
                              <div className="text-muted">—</div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* QUOTE SUBMISSION */}
                      <td className="px-3 py-4">
                        {alreadySubmitted ? (
                          <div className={`alert ${styles.successAlert}`}>
                            Quote already submitted for this shipment
                          </div>
                        ) : (
                          <div className="row g-2 align-items-start">
                            <div className="col-md-3">
                              <span className={styles.inputLabel}>
                                Transport Price (₹)
                              </span>
                              <div className="input-group input-group-sm">
                                <span
                                  className={`input-group-text bg-white border-end-0 text-muted ${styles.inputField}`}
                                >
                                  ₹
                                </span>
                                <input
                                  type="number"
                                  placeholder=""
                                  value={
                                    quoteData[shipmentId]?.quotedPrice || ""
                                  }
                                  onChange={(e) =>
                                    handleQuoteChange(
                                      shipmentId,
                                      "quotedPrice",
                                      e.target.value,
                                    )
                                  }
                                  className={`form-control border-start-0 ps-1 ${styles.inputField}`}
                                />
                              </div>
                            </div>

                            <div className="col-md-3">
                              <span className={styles.inputLabel}>
                                Delivery Days
                              </span>
                              <input
                                type="number"
                                placeholder="Enter days"
                                value={
                                  quoteData[shipmentId]
                                    ?.estimatedDeliveryDays || ""
                                }
                                onChange={(e) =>
                                  handleQuoteChange(
                                    shipmentId,
                                    "estimatedDeliveryDays",
                                    e.target.value,
                                  )
                                }
                                className={`form-control form-control-sm ${styles.inputField}`}
                              />
                            </div>

                            <div className="col-md-4">
                              <span className={styles.inputLabel}>
                                Additional Notes
                              </span>
                              <textarea
                                placeholder="Enter additional notes"
                                value={quoteData[shipmentId]?.note || ""}
                                onChange={(e) =>
                                  handleQuoteChange(
                                    shipmentId,
                                    "note",
                                    e.target.value,
                                  )
                                }
                                className={`form-control form-control-sm ${styles.textareaField}`}
                                rows={1}
                              />
                            </div>

                            <div className="col-md-2 pt-4">
                              <button
                                className={`btn btn-sm w-100 ${styles.submitBtn}`}
                                onClick={() => handleSubmitQuote(item)}
                                disabled={
                                  submitQuoteLoading &&
                                  activeShipmentId === shipmentId
                                }
                              >
                                {submitQuoteLoading &&
                                activeShipmentId === shipmentId ? (
                                  <span
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                ) : (
                                  "Submit Quote"
                                )}
                              </button>
                            </div>
                          </div>
                        )}
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

export default TransporterShipments;
