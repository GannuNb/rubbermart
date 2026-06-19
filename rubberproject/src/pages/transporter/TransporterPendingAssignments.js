import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPendingAssignmentsThunk } from "../../redux/slices/transporter/getPendingAssignmentsThunk";
import { acceptAssignmentThunk } from "../../redux/slices/transporter/acceptAssignmentThunk";
import { rejectAssignmentThunk } from "../../redux/slices/transporter/rejectAssignmentThunk";
import styles from "./TransporterPendingAssignments.module.css";

function TransporterPendingAssignments() {
  const dispatch = useDispatch();

  const [activeShipmentId, setActiveShipmentId] = useState(null);
  const [actionType, setActionType] = useState("");

  const {
    pendingAssignments,
    pendingAssignmentsLoading,
    pendingAssignmentsError,
    assignmentActionLoading,
    assignmentActionError,
    activeAssignmentShipmentId,
  } = useSelector((state) => state.transporter);

  /* =========================
     FETCH ASSIGNMENTS
  ========================= */
  useEffect(() => {
    dispatch(getPendingAssignmentsThunk());
  }, [dispatch]);

  /* =========================
     ACCEPT
  ========================= */
  const handleAccept = (item) => {
    setActiveShipmentId(item.shipment._id);
    setActionType("accept");

    dispatch(
      acceptAssignmentThunk({
        orderId: item.orderId,
        shipmentId: item.shipment._id,
      }),
    ).then(() => {
      setActiveShipmentId(null);
      setActionType("");
    });
  };

  /* =========================
     REJECT
  ========================= */
  const handleReject = (item) => {
    setActiveShipmentId(item.shipment._id);
    setActionType("reject");

    dispatch(
      rejectAssignmentThunk({
        orderId: item.orderId,
        shipmentId: item.shipment._id,
      }),
    ).then(() => {
      setActiveShipmentId(null);
      setActionType("");
    });
  };

  return (
    <div className={styles.container}>
      {/* =========================
          HEADER
      ========================= */}
      <div className="mb-4">
        <h2 className={styles.title}>Requests</h2>
        <p className={styles.subtitle}>
          Transportation requests assigned by admin for your review and
          confirmation.
        </p>
      </div>

      {/* =========================
          STATE FEEDBACK ALERTS
      ========================= */}
      {pendingAssignmentsLoading && (
        <div className="alert alert-info border-0 shadow-sm">
          Loading assignments...
        </div>
      )}

      {pendingAssignmentsError && (
        <div className="alert alert-danger border-0 shadow-sm">
          {pendingAssignmentsError}
        </div>
      )}

      {assignmentActionError && (
        <div className="alert alert-danger border-0 shadow-sm">
          {assignmentActionError}
        </div>
      )}

      {!pendingAssignmentsLoading && pendingAssignments.length === 0 && (
        <div className="alert alert-secondary border-0 shadow-sm text-center py-4">
          No pending assignment requests
        </div>
      )}

      {/* =========================
          PENDING REQUESTS GRID TABLE
      ========================= */}
      {!pendingAssignmentsLoading && pendingAssignments.length > 0 && (
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
                  <th className={styles.thText} style={{ width: "15%" }}>
                    Package Details
                  </th>
                  <th className={styles.thText} style={{ width: "23%" }}>
                    Admin Quote
                  </th>
                  <th className={styles.thText} style={{ width: "12%" }}>
                    Requested On
                  </th>
                  <th className={styles.thText} style={{ width: "17%" }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody style={{ borderTop: "none" }}>
                {pendingAssignments.map((item) => {
                  const isCurrentItem =
                    activeAssignmentShipmentId === item.shipment?._id ||
                    activeShipmentId === item.shipment?._id;

                  return (
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

                      {/* ADMIN OFFERED QUOTE */}
                      <td className="px-3 py-4">
                        <div className={styles.quoteBoxWrapper}>
                          <div className={styles.quoteRowItem}>
                            <span className={styles.quoteLabelText}>
                              Transport Price
                            </span>
                            <span className={styles.quoteValueTextPurple}>
                              ₹{" "}
                              {(
                                item.shipment?.adminAssignedPrice || 0
                              ).toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className={styles.quoteRowItem}>
  <span className={styles.quoteLabelText}>
    Delivery Days
  </span>

  <span className={styles.quoteValueText}>
    {Number(
      item?.shipment?.estimatedDeliveryDays,
    ) > 0
      ? `${item.shipment.estimatedDeliveryDays} Days`
      : Number(
            item?.transportQuote
              ?.estimatedDeliveryDays,
          ) > 0
        ? `${item.transportQuote.estimatedDeliveryDays} Days`
        : "N/A"}
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
                              {item.shipment?.adminAssignmentNote || "No note"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* REQUESTED ON TIMESTAMP */}
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

                      {/* ACTIONS STACK */}
                      <td className="px-3 py-4">
                        <div className={styles.actionStack}>
                          <button
                            className={styles.btnAccept}
                            onClick={() => handleAccept(item)}
                            disabled={
                              assignmentActionLoading &&
                              isCurrentItem &&
                              actionType === "accept"
                            }
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            {assignmentActionLoading &&
                            isCurrentItem &&
                            actionType === "accept"
                              ? "Accepting..."
                              : "Accept Request"}
                          </button>

                          <button
                            className={styles.btnReject}
                            onClick={() => handleReject(item)}
                            disabled={
                              assignmentActionLoading &&
                              isCurrentItem &&
                              actionType === "reject"
                            }
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            >
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="15" y1="9" x2="9" y2="15"></line>
                              <line x1="9" y1="9" x2="15" y2="15"></line>
                            </svg>
                            {assignmentActionLoading &&
                            isCurrentItem &&
                            actionType === "reject"
                              ? "Rejecting..."
                              : "Reject Request"}
                          </button>

                          <div className={styles.badgePending}>
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                            >
                              <circle cx="12" cy="12" r="10"></circle>
                              <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            Pending
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

export default TransporterPendingAssignments;
