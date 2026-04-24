import React from "react";
import {
  FaDownload,
  FaFileInvoice,
  FaWeightHanging,
  FaHeadset,
} from "react-icons/fa";
import styles from "../../../styles/Buyer/BuyerSingleShippingInvoice.module.css";

const ShipmentTrackingActionsSection = ({
  shipment,
}) => {
  const handleViewWeightTicket = () => {
    if (!shipment?.shipmentFile?.data) {
      return alert("Weight ticket not available");
    }

    let base64 = "";

    if (typeof shipment.shipmentFile.data === "string") {
      base64 = shipment.shipmentFile.data;
    } else if (shipment.shipmentFile.data?.data) {
      base64 = btoa(
        new Uint8Array(
          shipment.shipmentFile.data.data
        ).reduce(
          (data, byte) =>
            data + String.fromCharCode(byte),
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

  return (
    <div className={styles.bottomSectionWrapper}>
      {/* LEFT SIDE - TRACKING HISTORY */}
      <div className={styles.trackingCard}>
        <h3 className={styles.sectionTitle}>
          Shipment Tracking History
        </h3>

        <div className={styles.trackingTable}>
          {/* HEADER */}
          <div className={styles.trackingHeader}>
            <div>Date & Time</div>
            <div>Status</div>
            <div>Remarks</div>
          </div>

          {/* ROW 1 */}
          <div className={styles.trackingRow}>
            <div>
              {shipment?.createdAt
                ? new Date(
                    shipment.createdAt
                  ).toLocaleString()
                : "-"}
            </div>

            <div className={styles.successStatus}>
              ● Order Confirmed
            </div>

            <div>
              Order has been confirmed by Seller
            </div>
          </div>

          {/* ROW 2 */}
          <div className={styles.trackingRow}>
            <div>
              {shipment?.shippedAt
                ? new Date(
                    shipment.shippedAt
                  ).toLocaleString()
                : "-"}
            </div>

            <div className={styles.activeStatus}>
              ● Shipped
            </div>

            <div>
              Shipment picked up by the courier
            </div>
          </div>

          {/* ROW 3 */}
          <div className={styles.trackingRow}>
            <div>
              {shipment?.deliveredAt
                ? new Date(
                    shipment.deliveredAt
                  ).toLocaleString()
                : "Pending"}
            </div>

            <div className={styles.pendingStatus}>
              ● Delivered
            </div>

            <div>
              Shipment delivered successfully
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - ACTIONS */}
      <div className={styles.actionsSideCard}>
        <h3 className={styles.sectionTitle}>Actions</h3>

        <button
          className={styles.actionBtn}
          onClick={() =>
            alert("Invoice PDF coming next")
          }
        >
          <FaFileInvoice />
          Download Invoice
          <FaDownload />
        </button>

        <button
          className={styles.actionBtn}
          onClick={handleViewWeightTicket}
        >
          <FaWeightHanging />
          Download Weight-Ticket
          <FaDownload />
        </button>

        <div className={styles.helpCard}>
          <h4>Need help?</h4>
          <p>
            If you have any issues with your shipment
          </p>

          <button className={styles.supportBtn}>
            <FaHeadset />
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShipmentTrackingActionsSection;