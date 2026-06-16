import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { getShipmentQuotes } from "../../../redux/slices/adminOrders/adminShipmentQuotesThunk";

import { assignTransporterToShipment } from "../../../redux/slices/adminOrders/assignTransporterThunk";

import { getAllTransporters } from "../../../redux/slices/adminOrders/getAllTransportersThunk";

import { adminDirectAssignTransporter } from "../../../redux/slices/adminOrders/adminDirectAssignTransporterThunk";

import { markShipmentShippedByAdminThunk } from "../../../redux/slices/adminOrders/markShipmentShippedByAdminThunk";

import styles from "../../../styles/Admin/AdminSingleShippingInvoice.module.css";

function AdminTransportQuotesCard({ shipment }) {
  const dispatch = useDispatch();

  const {
    shipmentQuotes,
    shipmentQuotesLoading,
    shipmentQuotesError,
    assignTransporterLoading,
    transporters,
    transportersLoading,
    directAssignLoading,
    markShipmentShippedLoading,
    activeShipmentId,
  } = useSelector((state) => state.adminOrders);

  /* =========================
     LOCAL STATE
  ========================= */

  const [selectedTransporter, setSelectedTransporter] = useState("");

  const [activeQuoteId, setActiveQuoteId] = useState(null);

  const [adminPrice, setAdminPrice] = useState("");

  const [adminNote, setAdminNote] = useState("");

  /* =========================
     SHIPMENT QUOTES
  ========================= */

  const quotes = shipmentQuotes[shipment?._id] || [];

  /* =========================
     FETCH DATA
  ========================= */

  useEffect(() => {
    dispatch(getAllTransporters());

    if (
      shipment?._id &&
      [
        "quotes_received",
        "transporter_assigned",
        "open_for_quotes",
        "admin_assignment_pending",
      ].includes(shipment?.transportStatus)
    ) {
      dispatch(getShipmentQuotes(shipment._id));
    }
  }, [dispatch, shipment?._id, shipment?.transportStatus]);

  /* =========================
     ASSIGN TRANSPORTER
  ========================= */

  const handleAssignTransporter = (quoteId) => {
    setActiveQuoteId(quoteId);

    dispatch(
      assignTransporterToShipment({
        orderId: shipment?.orderId,

        shipmentId: shipment?._id,

        quoteId,
      }),
    ).then(() => {
      setActiveQuoteId(null);
    });
  };

  /* =========================
     DIRECT ASSIGNMENT
  ========================= */

  const handleDirectAssign = () => {
    if (!selectedTransporter) {
      return alert("Please select transporter");
    }

    if (!adminPrice) {
      return alert("Please enter transport price");
    }

    dispatch(
      adminDirectAssignTransporter({
        orderId: shipment?.orderId,

        shipmentId: shipment?._id,

        transporterId: selectedTransporter,

        adminPrice,

        adminNote,
      }),
    );
  };

  /* =========================
     MARK SHIPPED
  ========================= */

  const handleMarkShipped = () => {
    dispatch(
      markShipmentShippedByAdminThunk({
        orderId: shipment?.orderId,

        shipmentId: shipment?._id,
      }),
    );
  };

  return (
    <div className={styles.infoCard}>
      <h3 className={styles.cardTitle}>Transport Quotes</h3>

      {/* =========================
          OPEN FOR QUOTES
      ========================= */}

      {[
  "open_for_quotes",
  "quotes_received",
].includes(
  shipment?.transportStatus,
) &&
  quotes.length === 0 && (
    <div className={styles.emptyState}>
      Waiting for transporter quotes
    </div>
)}

      {/* =========================
          LOADING
      ========================= */}

      {shipmentQuotesLoading && (
        <div className={styles.emptyState}>Loading quotes...</div>
      )}

      {/* =========================
          ERROR
      ========================= */}

      {shipmentQuotesError && (
        <div className={styles.emptyState}>{shipmentQuotesError}</div>
      )}

      {/* =========================
          QUOTES LIST
      ========================= */}

      {!shipmentQuotesLoading && quotes.length > 0 && (
        <div className={styles.infoList}>
          {quotes.map((quote) => (
            <div key={quote._id} className={styles.infoRow}>
              <div
                style={{
                  width: "100%",
                }}
              >
                {/* TRANSPORTER */}

                <p className={styles.label}>Transporter</p>

                <h4 className={styles.value}>
                  {quote?.transporter?.fullName || "-"}
                </h4>

                {/* QUOTE PRICE */}

                <p className={styles.label}>
                  Quote Price : ₹
                  {Number(quote?.quotedPrice || 0).toLocaleString("en-IN")}
                </p>

                {/* DELIVERY DAYS */}

                <p className={styles.label}>
                  Delivery Days : {quote?.estimatedDeliveryDays || 0} Days
                </p>

                {/* GST TYPE */}

                {shipment?.transportGSTType && (
                  <p className={styles.label}>
                    GST Type :{" "}
                    {shipment.transportGSTType === "cgst_sgst"
                      ? "CGST + SGST"
                      : "IGST"}
                  </p>
                )}

                {/* FINAL AMOUNT */}

                {["transporter_assigned", "admin_assignment_pending"].includes(
                  shipment?.transportStatus,
                ) && (
                  <p className={styles.label}>
                    Final Transport Amount : ₹
                    {Number(shipment?.transportFinalAmount || 0).toLocaleString(
                      "en-IN",
                    )}
                  </p>
                )}

                {/* NOTE */}

                <p className={styles.label}>{quote?.note || "No note"}</p>

                {/* STATUS */}

                <p className={styles.label}>
                  {shipment?.transportStatus === "admin_assignment_pending"
                    ? "Waiting for transporter acceptance"
                    : shipment?.transportStatus === "transporter_assigned"
                      ? "Transporter assigned successfully"
                      : "Quote submitted"}
                </p>

                {/* =========================
                        BUTTONS
                    ========================= */}

                {shipment?.transportStatus === "transporter_assigned" ? (
                  <button className={styles.deliverBtn} disabled>
                    {quote?.quoteStatus === "selected"
                      ? "Assigned Transporter"
                      : "Transporter Already Assigned"}
                  </button>
                ) : shipment?.transportStatus === "admin_assignment_pending" ? (
                  <button className={styles.deliverBtn} disabled>
                    Waiting For Transporter Response
                  </button>
                ) : (
                  <button
                    className={styles.deliverBtn}
                    onClick={() => handleAssignTransporter(quote._id)}
                    disabled={
                      assignTransporterLoading && activeQuoteId === quote._id
                    }
                  >
                    {assignTransporterLoading && activeQuoteId === quote._id
                      ? "Assigning..."
                      : "Assign Transporter"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =========================
          MANUAL ASSIGNMENT
      ========================= */}

      {!["transporter_assigned", "admin_assignment_pending"].includes(
        shipment?.transportStatus,
      ) && (
        <div
          style={{
            marginTop: "20px",
            borderTop: "1px solid #ddd",
            paddingTop: "20px",
          }}
        >
          <p className={styles.label}>Manual Transporter Assignment</p>

          <select
            value={selectedTransporter}
            onChange={(e) => setSelectedTransporter(e.target.value)}
            className={styles.input}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "10px",
            }}
          >
            <option value="">Select Transporter</option>

            {transporters.map((transporter) => {
              const alreadyQuoted = quotes.some(
                (quote) => quote?.transporter?._id === transporter._id,
              );

              return (
                <option
                  key={transporter._id}
                  value={transporter._id}
                  disabled={alreadyQuoted}
                >
                  {transporter.fullName}

                  {alreadyQuoted ? " (Already Quoted)" : ""}
                </option>
              );
            })}
          </select>

          <input
            type="number"
            placeholder="Enter transport price"
            value={adminPrice}
            onChange={(e) => setAdminPrice(e.target.value)}
            className={styles.input}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "15px",
            }}
          />

          <textarea
            placeholder="Assignment note"
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            className={styles.input}
            rows={3}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "15px",
            }}
          />

          <button
            className={styles.deliverBtn}
            style={{
              marginTop: "15px",
            }}
            onClick={handleDirectAssign}
            disabled={directAssignLoading || transportersLoading}
          >
            {directAssignLoading
              ? "Sending Request..."
              : "Assign Transporter Manually"}
          </button>
        </div>
      )}

      {/* =========================
          ASSIGNED TRANSPORTER
      ========================= */}

      {(shipment?.transportStatus === "transporter_assigned" ||
        shipment?.transportStatus === "admin_assignment_pending") && (
        <div
          className={styles.infoList}
          style={{
            marginTop: "20px",
          }}
        >
          <div className={styles.infoRow}>
            <div>
              <p className={styles.label}>Assigned Transporter</p>

              <h4 className={styles.value}>
                {shipment?.assignedTransporter?.fullName || "-"}
              </h4>

              <p className={styles.label}>
                {shipment?.transportStatus === "admin_assignment_pending"
                  ? "Waiting for transporter acceptance"
                  : "Transporter assigned successfully"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          MARK SHIPPED
      ========================= */}

      {shipment?.transportStatus === "transporter_assigned" && (
        <div
          style={{
            marginTop: "20px",
          }}
        >
          {["shipped", "in_transit", "delivered", "completed"].includes(
            shipment?.shipmentStatus,
          ) ? (
            <button
              className={styles.deliverBtn}
              disabled
              style={{
                width: "100%",
                background: "#6b7280",
              }}
            >
              Shipment Shipped
            </button>
          ) : (
            <button
              className={styles.deliverBtn}
              onClick={handleMarkShipped}
              disabled={
                markShipmentShippedLoading && activeShipmentId === shipment?._id
              }
              style={{
                width: "100%",
              }}
            >
              {markShipmentShippedLoading && activeShipmentId === shipment?._id
                ? "Updating..."
                : "Mark As Shipped"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminTransportQuotesCard;
