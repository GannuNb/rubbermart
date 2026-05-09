import React from "react";
import {
  FaDownload,
  FaFileInvoice,
  FaWeightHanging,
  FaHeadset,
} from "react-icons/fa";

import { useDispatch } from "react-redux";

import { downloadShippingInvoiceThunk } from "../../../redux/slices/buyerOrderThunk";

import styles from "../../../styles/Buyer/BuyerSingleShippingInvoice.module.css";

const ShipmentTrackingActionsSection = ({
  shipment,
  order,
}) => {
  const dispatch = useDispatch();

  /* =========================
     WEIGHT TICKET
  ========================= */

  const handleViewWeightTicket = () => {
    if (!shipment?.shipmentFile?.data) {
      return alert(
        "Weight ticket not available"
      );
    }

    let base64 = "";

    if (
      typeof shipment.shipmentFile.data ===
      "string"
    ) {
      base64 = shipment.shipmentFile.data;
    } else if (
      shipment.shipmentFile.data?.data
    ) {
      base64 = btoa(
        new Uint8Array(
          shipment.shipmentFile.data.data
        ).reduce(
          (data, byte) =>
            data +
            String.fromCharCode(byte),
          ""
        )
      );
    }

    const fileUrl = `data:${
      shipment.shipmentFile.contentType ||
      "application/pdf"
    };base64,${base64}`;

    window.open(fileUrl, "_blank");
  };

  /* =========================
     DOWNLOAD INVOICE
  ========================= */

  const handleInvoiceDownload = () => {
    dispatch(
      downloadShippingInvoiceThunk(
        order._id,
        shipment._id
      )
    );
  };

  return (
    <div
      className={styles.bottomSectionWrapper}
    >
      {/* LEFT SIDE */}

      <div className={styles.trackingCard}>
        <h3 className={styles.sectionTitle}>
          Shipment Tracking History
        </h3>

        <div
          className={styles.trackingTable}
        >
          {/* HEADER */}

          <div
            className={styles.trackingHeader}
          >
            <div>Date & Time</div>
            <div>Status</div>
            <div>Remarks</div>
          </div>

          {/* ROW 1 */}

          <div
            className={styles.trackingRow}
          >
            <div>
              {shipment?.createdAt
                ? new Date(
                    shipment.createdAt
                  ).toLocaleString()
                : "-"}
            </div>

            <div
              className={
                styles.successStatus
              }
            >
              ● Order Confirmed
            </div>

            <div>
              Order has been confirmed
              by Seller
            </div>
          </div>

          {/* ROW 2 */}

          <div
            className={styles.trackingRow}
          >
            <div>
              {shipment?.shippedAt
                ? new Date(
                    shipment.shippedAt
                  ).toLocaleString()
                : "-"}
            </div>

            <div
              className={
                styles.activeStatus
              }
            >
              ● Shipped
            </div>

            <div>
              Shipment picked up by the
              courier
            </div>
          </div>

          {/* ROW 3 */}

          <div
            className={styles.trackingRow}
          >
            <div>
              {shipment?.deliveredAt
                ? new Date(
                    shipment.deliveredAt
                  ).toLocaleString()
                : "Pending"}
            </div>

            <div
              className={
                shipment?.deliveredAt
                  ? styles.successStatus
                  : styles.pendingStatus
              }
            >
              ● Delivered
            </div>

            <div>
              {shipment?.deliveredAt
                ? "Shipment delivered successfully"
                : "Shipment delivery pending"}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}

      <div
        className={styles.actionsSideCard}
      >
        <h3 className={styles.sectionTitle}>
          Actions
        </h3>

        {/* DOWNLOAD INVOICE */}

        <button
          className={styles.actionBtn}
          onClick={handleInvoiceDownload}
        >
          <FaFileInvoice />

          Download Invoice

          <FaDownload />
        </button>

        {/* DOWNLOAD WEIGHT TICKET */}

        <button
          className={styles.actionBtn}
          onClick={handleViewWeightTicket}
        >
          <FaWeightHanging />

          Download Weight-Ticket

          <FaDownload />
        </button>

        {/* SUPPORT */}

        <div className={styles.helpCard}>
          <h4>Need help?</h4>

          <p>
            If you have any issues with
            your shipment
          </p>

          <button
            className={styles.supportBtn}
          >
            <FaHeadset />
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShipmentTrackingActionsSection;