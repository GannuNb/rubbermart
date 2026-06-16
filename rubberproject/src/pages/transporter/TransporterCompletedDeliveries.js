// src/pages/transporter/TransporterCompletedDeliveries.jsx

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCompletedDeliveriesThunk } from "../../redux/slices/transporter/getCompletedDeliveriesThunk";
import styles from "./TransporterCompletedDeliveries.module.css";

function TransporterCompletedDeliveries() {
  const dispatch = useDispatch();

  const {
    completedDeliveries,
    completedDeliveriesLoading,
    completedDeliveriesError,
  } = useSelector((state) => state.transporter);

  /* =========================
      FETCH
  ========================= */
  useEffect(() => {
    dispatch(getCompletedDeliveriesThunk());
  }, [dispatch]);

  /* =========================
   OPEN FILE
========================= */

  const handleOpenFile = (file, fileName) => {
    if (!file?.data) {
      alert(`${fileName} not found`);
      return;
    }

    try {
      let byteArray = [];

      /* =========================
       HANDLE BUFFER FORMATS
    ========================= */

      if (Array.isArray(file.data)) {
        byteArray = file.data;
      } else if (Array.isArray(file.data?.data)) {
        byteArray = file.data.data;
      } else if (file.data?.type === "Buffer") {
        byteArray = file.data.data;
      } else {
        alert(`Invalid ${fileName}`);
        return;
      }

      /* =========================
       CREATE FILE
    ========================= */

      const uint8Array = new Uint8Array(byteArray);

      const blob = new Blob([uint8Array], {
        type: file.contentType || "application/octet-stream",
      });

      const fileURL = window.URL.createObjectURL(blob);

      window.open(fileURL, "_blank");
    } catch (error) {
      console.log("Open File Error:", error);

      alert(`Failed to open ${fileName}`);
    }
  };

  return (
    <div className={styles.container}>
      {/* =========================
          HEADER
      ========================= */}
      <div className="mb-4">
        <h2 className={styles.title}>Completed</h2>
        <p className={styles.subtitle}>
          Shipments that have been successfully delivered and completed.
        </p>
      </div>

      {/* =========================
          STATE ALERTS
      ========================= */}
      {completedDeliveriesLoading && (
        <div className="alert alert-info border-0 shadow-sm">
          Loading completed deliveries...
        </div>
      )}

      {completedDeliveriesError && (
        <div className="alert alert-danger border-0 shadow-sm">
          {completedDeliveriesError}
        </div>
      )}

      {!completedDeliveriesLoading && completedDeliveries.length === 0 && (
        <div className="alert alert-secondary border-0 shadow-sm text-center py-4">
          No completed deliveries found
        </div>
      )}

      {/* =========================
          DATA DISPLAY GRID
      ========================= */}
      {!completedDeliveriesLoading && completedDeliveries.length > 0 && (
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
                  <th className={styles.thText} style={{ width: "14%" }}>
                    Route
                  </th>
                  <th className={styles.thText} style={{ width: "15%" }}>
                    Package Details
                  </th>
                  <th className={styles.thText} style={{ width: "22%" }}>
                    Quote Details
                  </th>
                  <th className={styles.thText} style={{ width: "10%" }}>
                    Delivered On
                  </th>
                  <th className={styles.thText} style={{ width: "13%" }}>
                    Documents
                  </th>
                  <th className={styles.thText} style={{ width: "8%" }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody style={{ borderTop: "none" }}>
                {completedDeliveries.map((item) => (
                  <tr key={item.shipment?._id} className={styles.rowBorder}>
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
                          <span className={styles.routeLabel}>From: Ex</span>
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
                            {item.shipment?.transportHSNCode || "—"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* QUOTE DETAILS */}
                    <td className="px-3 py-4">
                      <div className={styles.quoteBoxWrapper}>
                        <div className={styles.quoteRowItem}>
                          <span className={styles.quoteLabelText}>
                            Transport Price
                          </span>

                          <span className={styles.quoteValueTextPurple}>
                            ₹{" "}
                            {Number(item?.transportAmount || 0).toLocaleString(
                              "en-IN",
                            )}
                          </span>
                        </div>

                        <div className={styles.quoteRowItem}>
                          <span className={styles.quoteLabelText}>
                            Delivery Days
                          </span>

                          <span className={styles.quoteValueText}>
                            {item?.transportQuote?.estimatedDeliveryDays
                              ? `${item.transportQuote.estimatedDeliveryDays} Days`
                              : "—"}
                          </span>
                        </div>

                        <div
                          className={styles.quoteRowItem}
                          style={{ alignItems: "flex-start" }}
                        >
                          <span className={styles.quoteLabelText}>
                            Additional Note
                          </span>

                          <span className={styles.quoteNoteText}>
                            {item?.transportQuote?.note || "No note"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* DELIVERED ON TIMESTAMPS */}
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
                          {item.shipment?.deliveredAt ? (
                            <>
                              <span className={styles.routeLabel}>
                                Delivered On
                              </span>
                              <div className={styles.dateText}>
                                {new Date(
                                  item.shipment.deliveredAt,
                                ).toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </div>
                              <div className={styles.timeText}>
                                {new Date(
                                  item.shipment.deliveredAt,
                                ).toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </div>
                              <div className={styles.tripCompletedText}>
                                Trip Completed
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
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#6b7280"
                              strokeWidth="2"
                            >
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>

                              <polyline points="14 2 14 8 20 8"></polyline>

                              <line x1="16" y1="13" x2="8" y2="13"></line>

                              <line x1="16" y1="17" x2="8" y2="17"></line>
                            </svg>

                            <div className="overflow-hidden">
                              <div
                                className={styles.docTitle}
                                title="Weight Ticket"
                              >
                                Weight Ticket
                              </div>

                              <div className={styles.docSize}>
                                {item?.shipment?.weightTicket?.contentType?.includes(
                                  "image",
                                )
                                  ? "Image"
                                  : "PDF"}
                              </div>
                            </div>
                          </div>

                          {item?.shipment?.weightTicket?.data ? (
                            <button
                              type="button"
                              className={styles.btnDocDownload}
                              onClick={() =>
                                handleOpenFile(
                                  item.shipment.weightTicket,
                                  "Weight Ticket",
                                )
                              }
                              title="View Weight Ticket"
                            >
                              View
                            </button>
                          ) : (
                            <span
                              className="text-muted"
                              style={{ fontSize: "0.75rem" }}
                            >
                              —
                            </span>
                          )}
                        </div>

                        {/* PACKED PHOTO */}

                        <div className={styles.docItemBlock}>
                          <div className={styles.docMetaWrapper}>
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#6b7280"
                              strokeWidth="2"
                            >
                              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4A2 2 0 0 0 21 16z"></path>
                            </svg>

                            <div className="overflow-hidden">
                              <div
                                className={styles.docTitle}
                                title="Packed Photo"
                              >
                                Packed Photo
                              </div>

                              <div className={styles.docSize}>
                                {item?.shipment?.packedItemPhoto?.contentType?.includes(
                                  "image",
                                )
                                  ? "Image"
                                  : "PDF"}
                              </div>
                            </div>
                          </div>

                          {item?.shipment?.packedItemPhoto?.data ? (
                            <button
                              type="button"
                              className={styles.btnDocDownload}
                              onClick={() =>
                                handleOpenFile(
                                  item.shipment.packedItemPhoto,
                                  "Packed Photo",
                                )
                              }
                              title="View Packed Photo"
                            >
                              View
                            </button>
                          ) : (
                            <span
                              className="text-muted"
                              style={{ fontSize: "0.75rem" }}
                            >
                              —
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* STATUS ACTION BADGE */}
                    <td className="px-3 py-4">
                      <span className={styles.completedBadge}>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Completed
                      </span>
                      {item.shipment?.deliveredAt && (
                        <div className={styles.completedMetaText}>
                          Completed On
                          <br />
                          {new Date(
                            item.shipment.deliveredAt,
                          ).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                          <br />
                          {new Date(
                            item.shipment.deliveredAt,
                          ).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransporterCompletedDeliveries;
