// src/pages/transporter/TransporterAssignedShipments.jsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAssignedShipmentsThunk } from "../../redux/slices/transporter/getAssignedShipmentsThunk";
import { markShipmentShippedThunk } from "../../redux/slices/transporter/markShipmentShippedThunk";
import styles from "./TransporterAssignedShipments.module.css";

function TransporterAssignedShipments() {
  const dispatch = useDispatch();

  const [activeShipmentId, setActiveShipmentId] = useState(null);

  const {
    assignedShipments,
    assignedShipmentsLoading,
    assignedShipmentsError,
    markShippedLoading,
  } = useSelector((state) => state.transporter);

  /* =========================
      FETCH
  ========================= */
  useEffect(() => {
    dispatch(getAssignedShipmentsThunk());
  }, [dispatch]);

  /* =========================
      MARK SHIPPED
  ========================= */
  const handleMarkShipped = (item) => {
    setActiveShipmentId(item.shipment?._id);

    dispatch(
      markShipmentShippedThunk({
        orderId: item.orderId,
        shipmentId: item.shipment?._id,
      }),
    ).then(() => {
      setActiveShipmentId(null);
    });
  };

  /* =========================
      OPEN FILE
  ========================= */
  const handleOpenFile = (file, fileName) => {
    if (!file?.data) {
      alert(`${fileName} not found`);
      return;
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
      alert(`Failed to open ${fileName}`);
    }
  };

  return (
    <div className={styles.container}>
      {/* =========================
          HEADER
      ========================= */}
      <div className="mb-4">
        <h2 className={styles.title}>Assigned</h2>
        <p className={styles.subtitle}>
          Shipments you have accepted and are assigned for transportation.
        </p>
      </div>

      {/* =========================
          STATE ALERTS
      ========================= */}
      {assignedShipmentsLoading && (
        <div className="alert alert-info border-0 shadow-sm">Loading assigned shipments...</div>
      )}

      {assignedShipmentsError && (
        <div className="alert alert-danger border-0 shadow-sm">{assignedShipmentsError}</div>
      )}

      {!assignedShipmentsLoading && assignedShipments.length === 0 && (
        <div className="alert alert-secondary border-0 shadow-sm text-center py-4">
          No assigned shipments found
        </div>
      )}

      {/* =========================
          DATA DISPLAY GRID
      ========================= */}
      {!assignedShipmentsLoading && assignedShipments.length > 0 && (
        <>
          <div className={`card ${styles.tableCard} mb-3`}>
            <div className="table-responsive">
              <table className={`table align-middle mb-0 ${styles.tableMinWidth}`}>
                <thead className={styles.tableHeader}>
                  <tr>
                    <th className={styles.thText} style={{ width: "18%" }}>Shipment Details</th>
                    <th className={styles.thText} style={{ width: "14%" }}>Route</th>
                    <th className={styles.thText} style={{ width: "15%" }}>Package Details</th>
                    <th className={styles.thText} style={{ width: "22%" }}>Quote Details</th>
                    <th className={styles.thText} style={{ width: "10%" }}>Assigned On</th>
                    <th className={styles.thText} style={{ width: "13%" }}>Documents</th>
                    <th className={styles.thText} style={{ width: "8%" }}>Status</th>
                  </tr>
                </thead>
                <tbody style={{ borderTop: "none" }}>
                  {assignedShipments.map((item) => {
                    const isCurrentMarking = markShippedLoading && activeShipmentId === item.shipment?._id;
                    const isShipped = item.shipment?.shipmentStatus === "shipped";
                    
                    // Fallback structural parsing matching your dynamic populated schema properties
                    const transportPrice = item.shipment?.transporterQuoteId?.quotedPrice || item.quotedPrice || item.shipment?.adminAssignedPrice || item.bidPrice || item.price || 0;
                    const deliveryDays = item.shipment?.transporterQuoteId?.estimatedDeliveryDays || item.estimatedDeliveryDays || item.shipment?.estimatedDeliveryDays || item.deliveryDays || "—";
                    const additionalNote = item.shipment?.transporterQuoteId?.note || item.note || item.shipment?.adminAssignmentNote || "—";

                    return (
                      <tr key={item.shipment?._id} className={styles.rowBorder}>
                        
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
                                Order ID: {item.orderInvoiceId || "N/A"}
                              </div>
                              <div className={styles.invoiceId}>
                                Invoice ID: {item.shipment?.shipmentInvoiceId || "N/A"}
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
                              <span className={styles.routeText}>{item.shipment?.shipmentFrom || "N/A"}</span>
                            </div>
                            <div>
                              <span className={styles.routeLabel}>To:</span>
                              <span className={styles.routeText}>{item.shipment?.shipmentTo || "N/A"}</span>
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
                                <strong className="fw-semibold">Item:</strong> {item.shipment?.selectedItem || "N/A"}
                              </div>
                              <div className={styles.packageSubText}>
                                <strong className="fw-semibold">Quantity:</strong> {item.shipment?.shippedQuantity || "0"} MT
                              </div>
                              <div className={styles.hsnText}>
                                Transport HSN: {item.shipment?.transportHSNCode || "—"}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* QUOTE DETAILS */}
                        <td className="px-3 py-4">
                          <div className={styles.quoteBoxWrapper}>
                            <div className={styles.quoteRowItem}>
                              <span className={styles.quoteLabelText}>Transport Price</span>
                              <span className={styles.quoteValueTextPurple}>₹ {Number(transportPrice).toLocaleString('en-IN')}</span>
                            </div>
                            <div className={styles.quoteRowItem}>
                              <span className={styles.quoteLabelText}>Delivery Days</span>
                              <span className={styles.quoteValueText}>{deliveryDays} {deliveryDays !== "—" ? "Days" : ""}</span>
                            </div>
                            <div className={styles.quoteRowItem} style={{ alignItems: 'flex-start' }}>
                              <span className={styles.quoteLabelText}>Additional Note</span>
                              <span className={styles.quoteNoteText}>{additionalNote}</span>
                            </div>
                          </div>
                        </td>

                        {/* ASSIGNED ON TIMESTAMP */}
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
                              {item.shipment?.createdAt || item.createdAt ? (
                                <>
                                  <div className={styles.dateText}>
                                    {new Date(item.shipment?.createdAt || item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                  </div>
                                  <div className={styles.timeText}>
                                    {new Date(item.shipment?.createdAt || item.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                  </div>
                                </>
                              ) : (
                                <div className="text-muted">—</div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* DOCUMENTS SECTION */}
                        <td className="px-3 py-4">
                          <div className={styles.docContainerStack}>
                            {/* WEIGHT TICKET */}
                            <div className={styles.docItemBlock}>
                              <div className={styles.docMetaWrapper}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                  <polyline points="14 2 14 8 20 8"></polyline>
                                  <line x1="16" y1="13" x2="8" y2="13"></line>
                                  <line x1="16" y1="17" x2="8" y2="17"></line>
                                  <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                                <div className="overflow-hidden">
                                  <div className={styles.docTitle} title="Weight Ticket">Weight Ticket</div>
                                  <div className={styles.docSize}>254 KB</div>
                                </div>
                              </div>
                              {item.shipment?.weightTicket?.data ? (
                                <button
                                  type="button"
                                  className={styles.btnDocView}
                                  onClick={() => handleOpenFile(item.shipment.weightTicket, "Weight Ticket")}
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                  </svg>
                                  View
                                </button>
                              ) : (
                                <span className="text-muted" style={{ fontSize: '0.75rem' }}>Empty</span>
                              )}
                            </div>

                            {/* PACKED PHOTO */}
                            <div className={styles.docItemBlock}>
                              <div className={styles.docMetaWrapper}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                </svg>
                                <div className="overflow-hidden">
                                  <div className={styles.docTitle} title="Packed Photo">Packed Photo</div>
                                  <div className={styles.docSize}>1.2 MB</div>
                                </div>
                              </div>
                              {item.shipment?.packedItemPhoto?.data ? (
                                <button
                                  type="button"
                                  className={styles.btnDocView}
                                  onClick={() => handleOpenFile(item.shipment.packedItemPhoto, "Packed Photo")}
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                  </svg>
                                  View
                                </button>
                              ) : (
                                <span className="text-muted" style={{ fontSize: '0.75rem' }}>Empty</span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* STATUS ACTION ELEMENT */}
                        <td className="px-3 py-4">
                          {isShipped ? (
                            <button className={styles.btnShippedAction} style={{ backgroundColor: '#6b7280' }} disabled>
                              Shipped
                            </button>
                          ) : (
                            <button
                              className={styles.btnShippedAction}
                              onClick={() => handleMarkShipped(item)}
                              disabled={isCurrentMarking}
                            >
                              {isCurrentMarking ? "Updating..." : "Mark As Shipped"}
                            </button>
                          )}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* LOWER INFORMATIONAL LABELS */}
          <div className={styles.footerInstructions}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>After marking as shipped, the shipment will move to Completed once delivery is confirmed.</span>
          </div>
        </>
      )}
    </div>
  );
}

export default TransporterAssignedShipments;