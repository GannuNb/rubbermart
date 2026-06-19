import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { getShipmentQuotes } from "../../../redux/slices/adminOrders/adminShipmentQuotesThunk";

import { assignTransporterToShipment } from "../../../redux/slices/adminOrders/assignTransporterThunk";

import { getAllTransporters } from "../../../redux/slices/adminOrders/getAllTransportersThunk";

import { adminDirectAssignTransporter } from "../../../redux/slices/adminOrders/adminDirectAssignTransporterThunk";

import { markShipmentShippedByAdminThunk } from "../../../redux/slices/adminOrders/markShipmentShippedByAdminThunk";

import styles from "../../../styles/Admin/AdminTransportQuotesCard.module.css";

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

  const [estimatedDeliveryDays, setEstimatedDeliveryDays] = useState("");

  const [adminNote, setAdminNote] = useState("");

  /* =========================
     QUOTES
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
     ASSIGN EXISTING QUOTE
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
     MANUAL ASSIGNMENT
  ========================= */

  const handleDirectAssign = () => {
    if (!selectedTransporter) {
      return alert("Please select transporter");
    }

    if (!adminPrice) {
      return alert("Please enter transport price");
    }

    if (!estimatedDeliveryDays) {
      return alert("Please enter estimated delivery days");
    }

    dispatch(
      adminDirectAssignTransporter({
        orderId: shipment?.orderId,

        shipmentId: shipment?._id,

        transporterId: selectedTransporter,

        adminPrice,

        estimatedDeliveryDays,

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
    <div className={styles.transportCard}>
      {/* =========================
          HEADER
      ========================= */}

      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Transport Quotes</h3>

        <div className={styles.quoteBadge}>{quotes.length} Quotes</div>
      </div>

      {/* =========================
          EMPTY STATE
      ========================= */}

      {["open_for_quotes", "quotes_received"].includes(
        shipment?.transportStatus,
      ) &&
        quotes.length === 0 && (
          <div className={styles.emptyState}>
            Waiting for transporter quotes...
          </div>
        )}

      {/* =========================
          LOADING
      ========================= */}

      {shipmentQuotesLoading && (
        <div className={styles.emptyState}>Loading transporter quotes...</div>
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

      {!shipmentQuotesLoading &&
        quotes.length > 0 &&
        !(
          shipment?.assignmentMethod === "admin_direct_assignment" &&
          shipment?.transportStatus === "transporter_assigned"
        ) && (
          <div className={styles.quotesGrid}>
            {quotes.map((quote) => (
              <div key={quote._id} className={styles.quoteCard}>
                {/* TOP */}

                <div className={styles.quoteTop}>
                  <h3 className={styles.transporterName}>
                    {quote?.transporter?.fullName || "-"}
                  </h3>

                  <div className={styles.statusPill}>{quote?.quoteStatus}</div>
                </div>

                {/* DETAILS */}

                <div className={styles.quoteDetails}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Quote Price</span>

                    <span
                      className={`${styles.detailValue} ${styles.priceValue}`}
                    >
                      ₹{Number(quote?.quotedPrice || 0).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Delivery Days</span>

                    <span className={styles.detailValue}>
                      {quote?.estimatedDeliveryDays} Days
                    </span>
                  </div>

                  {shipment?.transportGSTType && (
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>GST Type</span>

                      <span className={styles.detailValue}>
                        {shipment.transportGSTType === "cgst_sgst"
                          ? "CGST + SGST"
                          : "IGST"}
                      </span>
                    </div>
                  )}

                  {[
                    "transporter_assigned",
                    "admin_assignment_pending",
                  ].includes(shipment?.transportStatus) && (
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Final Amount</span>

                      <span
                        className={`${styles.detailValue} ${styles.priceValue}`}
                      >
                        ₹
                        {Number(
                          shipment?.transportFinalAmount || 0,
                        ).toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                </div>

                {/* NOTE */}

                <div className={styles.noteBox}>
                  <p className={styles.noteText}>
                    {quote?.note || "No additional note provided"}
                  </p>
                </div>

                {/* BUTTONS */}

                {shipment?.transportStatus === "transporter_assigned" ? (
                  <button className={styles.secondaryBtn} disabled>
                    {quote?.quoteStatus === "selected"
                      ? "Assigned Transporter"
                      : "Transporter Already Assigned"}
                  </button>
                ) : shipment?.transportStatus === "admin_assignment_pending" ? (
                  <button className={styles.secondaryBtn} disabled>
                    Waiting For Acceptance
                  </button>
                ) : (
                  <button
                    className={styles.primaryBtn}
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
            ))}
          </div>
        )}

      {/* =========================
          MANUAL ASSIGNMENT
      ========================= */}

      {!["transporter_assigned", "admin_assignment_pending"].includes(
        shipment?.transportStatus,
      ) && (
        <div className={styles.manualSection}>
          <h3 className={styles.manualTitle}>Manual Transporter Assignment</h3>

          <div className={styles.formGrid}>
            {/* SELECT */}

            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
              <label className={styles.inputLabel}>Select Transporter</label>

              <select
                value={selectedTransporter}
                onChange={(e) => setSelectedTransporter(e.target.value)}
                className={styles.selectField}
              >
                <option value="">Choose transporter</option>

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
            </div>

            {/* PRICE */}

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Transport Price</label>

              <input
                type="number"
                placeholder="Enter transport price"
                value={adminPrice}
                onChange={(e) => setAdminPrice(e.target.value)}
                className={styles.inputField}
              />
            </div>

            {/* DAYS */}

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                Estimated Delivery Days
              </label>

              <input
                type="number"
                placeholder="Delivery days"
                value={estimatedDeliveryDays}
                onChange={(e) => setEstimatedDeliveryDays(e.target.value)}
                className={styles.inputField}
              />
            </div>

            {/* NOTE */}

            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
              <label className={styles.inputLabel}>Assignment Note</label>

              <textarea
                placeholder="Enter admin note..."
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                className={styles.textareaField}
              />
            </div>
          </div>

          <button
            className={styles.primaryBtn}
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

      {[
        "transporter_assigned",
        "admin_assignment_pending",
        "completed",
      ].includes(shipment?.transportStatus) && (
        <div className={styles.assignedCard}>
          <p className={styles.assignedTitle}>Assigned Transporter</p>

          <h3 className={styles.assignedName}>
  {shipment?.assignedTransporter?.fullName ||
    quotes?.find(
      (quote) =>
        quote?.quoteStatus === "selected",
    )?.transporter?.fullName ||
    "-"}
</h3>

          <p className={styles.assignedStatus}>
            {shipment?.transportStatus === "admin_assignment_pending"
              ? "Waiting for transporter acceptance"
              : shipment?.transportStatus === "completed"
                ? "Shipment delivered successfully"
                : "Transporter assigned successfully"}
          </p>

          {/* DETAILS */}

          <div
            className={styles.quoteDetails}
            style={{
              marginTop: "20px",
            }}
          >
            {/* PRICE */}

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Transport Price</span>

              <span className={`${styles.detailValue} ${styles.priceValue}`}>
                ₹{Number(shipment?.transportPrice || 0).toLocaleString("en-IN")}
              </span>
            </div>

            {/* DELIVERY DAYS */}

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Estimated Delivery</span>

              <span className={styles.detailValue}>
                {shipment?.estimatedDeliveryDays || 0} Days
              </span>
            </div>

            {/* GST */}

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>GST Type</span>

              <span className={styles.detailValue}>
                {shipment?.transportGSTType === "cgst_sgst"
                  ? "CGST + SGST"
                  : "IGST"}
              </span>
            </div>

            {/* FINAL AMOUNT */}

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Final Amount</span>

              <span className={`${styles.detailValue} ${styles.priceValue}`}>
                ₹
                {Number(shipment?.transportFinalAmount || 0).toLocaleString(
                  "en-IN",
                )}
              </span>
            </div>
          </div>

          {/* NOTE */}

          {shipment?.adminAssignmentNote && (
            <div className={styles.noteBox}>
              <p className={styles.noteText}>{shipment?.adminAssignmentNote}</p>
            </div>
          )}
        </div>
      )}

      {/* =========================
          MARK SHIPPED
      ========================= */}

      {shipment?.transportStatus === "transporter_assigned" && (
        <div
          style={{
            marginTop: "25px",
          }}
        >
          {["shipped", "in_transit", "delivered", "completed"].includes(
            shipment?.shipmentStatus,
          ) ? (
            <button className={styles.secondaryBtn} disabled>
              Shipment Already Shipped
            </button>
          ) : (
            <button
              className={styles.primaryBtn}
              onClick={handleMarkShipped}
              disabled={
                markShipmentShippedLoading && activeShipmentId === shipment?._id
              }
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
