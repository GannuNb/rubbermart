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
          LOADING
      ========================= */}

      {assignedShipmentsLoading && (
        <div className="alert alert-info border-0 shadow-sm">
          Loading assigned shipments...
        </div>
      )}

      {/* =========================
          ERROR
      ========================= */}

      {assignedShipmentsError && (
        <div className="alert alert-danger border-0 shadow-sm">
          {assignedShipmentsError}
        </div>
      )}

      {/* =========================
          EMPTY
      ========================= */}

      {!assignedShipmentsLoading && assignedShipments.length === 0 && (
        <div className="alert alert-secondary border-0 shadow-sm text-center py-4">
          No assigned shipments found
        </div>
      )}

      {/* =========================
          TABLE
      ========================= */}

      {!assignedShipmentsLoading && assignedShipments.length > 0 && (
        <>
          <div className={`card ${styles.tableCard} mb-3`}>
            <div className="table-responsive">
              <table
                className={`table align-middle mb-0 ${styles.tableMinWidth}`}
              >
                <thead className={styles.tableHeader}>
                  <tr>
                    <th
                      className={styles.thText}
                      style={{
                        width: "18%",
                      }}
                    >
                      Shipment Details
                    </th>

                    <th
                      className={styles.thText}
                      style={{
                        width: "14%",
                      }}
                    >
                      Route
                    </th>

                    <th
                      className={styles.thText}
                      style={{
                        width: "15%",
                      }}
                    >
                      Package Details
                    </th>

                    <th
                      className={styles.thText}
                      style={{
                        width: "22%",
                      }}
                    >
                      Quote Details
                    </th>

                    <th
                      className={styles.thText}
                      style={{
                        width: "10%",
                      }}
                    >
                      Assigned On
                    </th>

                    <th
                      className={styles.thText}
                      style={{
                        width: "13%",
                      }}
                    >
                      Documents
                    </th>

                    <th
                      className={styles.thText}
                      style={{
                        width: "8%",
                      }}
                    >
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody
                  style={{
                    borderTop: "none",
                  }}
                >
                  {assignedShipments.map((item) => {
                    const shipment = item.shipment;

                    const transportQuote = item.transportQuote;

                    const isCurrentMarking =
                      markShippedLoading && activeShipmentId === shipment?._id;

                    const isShipped = shipment?.shipmentStatus === "shipped";

                    return (
                      <tr key={shipment?._id} className={styles.rowBorder}>
                        {/* SHIPMENT DETAILS */}

                        <td className="px-4 py-4">
                          <div className="d-flex align-items-start gap-2">
                            <div className={styles.iconBoxLarge}>📦</div>

                            <div>
                              <div className={styles.orderId}>
                                Order ID: {item.orderInvoiceId}
                              </div>

                              <div className={styles.invoiceId}>
                                Invoice ID: {shipment?.shipmentInvoiceId}
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
                              <span className={styles.routeLabel}>From:</span>

                              <span className={styles.routeText}>
                                {" "}
                                {shipment?.shipmentFrom}
                              </span>
                            </div>

                            <div>
                              <span className={styles.routeLabel}>To:</span>

                              <span className={styles.routeText}>
                                {" "}
                                {shipment?.shipmentTo}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* PACKAGE */}

                        <td className="px-3 py-4">
                          <div className="d-flex align-items-start gap-2">
                            <div className={styles.iconBoxSmall}>📦</div>

                            <div>
                              <div className={styles.packageText}>
                                <strong>Item:</strong> {shipment?.selectedItem}
                              </div>

                              <div className={styles.packageSubText}>
                                <strong>Quantity:</strong>{" "}
                                {shipment?.shippedQuantity} MT
                              </div>

                              <div className={styles.hsnText}>
                                Transport HSN: {shipment?.transportHSNCode}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* QUOTE */}

                        <td className="px-3 py-4">
                          <div className={styles.quoteBoxWrapper}>
                            <div className={styles.quoteRowItem}>
                              <span className={styles.quoteLabelText}>
                                Transport Price
                              </span>

                              <span className={styles.quoteValueTextPurple}>
                                ₹{" "}
                                {Number(
                                  transportQuote?.quotedPrice || 0,
                                ).toLocaleString("en-IN")}
                              </span>
                            </div>

                            <div className={styles.quoteRowItem}>
                              <span className={styles.quoteLabelText}>
                                Delivery Days
                              </span>

                              <span className={styles.quoteValueText}>
                                {transportQuote?.estimatedDeliveryDays || "-"}{" "}
                                {transportQuote?.estimatedDeliveryDays
                                  ? "Days"
                                  : ""}
                              </span>
                            </div>

                            <div
                              className={styles.quoteRowItem}
                              style={{
                                alignItems: "flex-start",
                              }}
                            >
                              <span className={styles.quoteLabelText}>
                                Additional Note
                              </span>

                              <span className={styles.quoteNoteText}>
                                {transportQuote?.note || "-"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* DATE */}

                        <td className="px-3 py-4">
                          <div className="d-flex align-items-start gap-2">
                            <div className={styles.iconBoxSmall}>📅</div>

                            <div>
                              {shipment?.assignedAt ? (
                                <>
                                  <div className={styles.dateText}>
                                    {new Date(
                                      shipment.assignedAt,
                                    ).toLocaleDateString("en-GB", {
                                      day: "numeric",

                                      month: "short",

                                      year: "numeric",
                                    })}
                                  </div>

                                  <div className={styles.timeText}>
                                    {new Date(
                                      shipment.assignedAt,
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

                        {/* DOCUMENTS */}

                        <td className="px-3 py-4">
                          <div className={styles.docContainerStack}>
                            {/* WEIGHT TICKET */}

                            <div className={styles.docItemBlock}>
                              <div className={styles.docMetaWrapper}>
                                <div>
                                  <div className={styles.docTitle}>
                                    Weight Ticket
                                  </div>

                                  <div className={styles.docSize}>
                                    {shipment?.weightTicket?.contentType?.includes(
                                      "image",
                                    )
                                      ? "Image"
                                      : "PDF"}
                                  </div>
                                </div>
                              </div>

                              {shipment?.weightTicket?.data && (
                                <button
                                  type="button"
                                  className={styles.btnDocView}
                                  onClick={() =>
                                    handleOpenFile(
                                      shipment.weightTicket,
                                      "Weight Ticket",
                                    )
                                  }
                                >
                                  View
                                </button>
                              )}
                            </div>

                            {/* PACKED PHOTO */}

                            <div className={styles.docItemBlock}>
                              <div className={styles.docMetaWrapper}>
                                <div>
                                  <div className={styles.docTitle}>
                                    Packed Photo
                                  </div>

                                  <div className={styles.docSize}>
                                    {shipment?.packedItemPhoto?.contentType?.includes(
                                      "image",
                                    )
                                      ? "Image"
                                      : "PDF"}
                                  </div>
                                </div>
                              </div>

                              {shipment?.packedItemPhoto?.data && (
                                <button
                                  type="button"
                                  className={styles.btnDocView}
                                  onClick={() =>
                                    handleOpenFile(
                                      shipment.packedItemPhoto,
                                      "Packed Photo",
                                    )
                                  }
                                >
                                  View
                                </button>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* ACTION */}

                        <td className="px-3 py-4">
                          {isShipped ? (
                            <button
                              className={styles.btnShippedAction}
                              disabled
                            >
                              Shipped
                            </button>
                          ) : (
                            <button
                              className={styles.btnShippedAction}
                              onClick={() => handleMarkShipped(item)}
                              disabled={isCurrentMarking}
                            >
                              {isCurrentMarking
                                ? "Updating..."
                                : "Mark As Shipped"}
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

          {/* FOOTER */}

          <div className={styles.footerInstructions}>
            <span>ⓘ</span>

            <span>
              After marking as shipped, the shipment will move to Completed once
              delivery is confirmed.
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export default TransporterAssignedShipments;
