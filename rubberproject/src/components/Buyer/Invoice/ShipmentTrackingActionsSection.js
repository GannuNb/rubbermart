import React, { useState } from "react";
import {
  FaDownload,
  FaFileInvoice,
  FaWeightHanging,
  FaHeadset,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { downloadShippingInvoiceThunk } from "../../../redux/slices/buyerOrderThunk";
import styles from "../../../styles/Buyer/BuyerSingleShippingInvoice.module.css";

const ShipmentTrackingActionsSection = ({ shipment, order }) => {
  const dispatch = useDispatch();

  /* =========================
      ACCORDION STATES
  ========================= */
  const [isOpen, setIsOpen] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  /* =========================
      WEIGHT TICKET
  ========================= */
  const handleViewWeightTicket = () => {
    try {
      if (!shipment?.weightTicket?.data) {
        return alert("Weight ticket not available");
      }

      let base64 = "";

      if (typeof shipment.weightTicket.data === "string") {
        base64 = shipment.weightTicket.data;
      } else if (shipment.weightTicket.data?.data) {
        base64 = btoa(
          new Uint8Array(shipment.weightTicket.data.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            "",
          ),
        );
      }

      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {
        type: shipment.weightTicket.contentType || "application/pdf",
      });

      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");

      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 1000);
    } catch (error) {
      console.log("Weight Ticket Open Error:", error);
      alert("Failed to open document");
    }
  };

  /* =========================
      DOWNLOAD INVOICE
  ========================= */
  const handleInvoiceDownload = () => {
    dispatch(downloadShippingInvoiceThunk(order._id, shipment._id));
  };

  return (
    <div className={styles.bottomSectionWrapper}>
      {/* LEFT SIDE: COLLAPSIBLE TRACKING HISTORY */}
      <div className={styles.trackingCard} style={{ padding: "0", overflow: "hidden" }}>
        
        {/* ACCORDION HEADER BAR */}
        <div 
          className={styles.cardAccordionHeader}
          onClick={() => setIsOpen(!isOpen)}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between", 
            padding: "24px 28px", 
            cursor: "pointer", 
            userSelect: "none" 
          }}
        >
          <h3 className={styles.sectionTitle} style={{ margin: "0" }}>
            Shipment Tracking History
          </h3>
          
          <div className={`${styles.toggleIconBtn} ${isOpen ? styles.activeToggle : ""}`}>
            {isOpen ? "−" : "+"}
          </div>
        </div>

        {/* ACCORDION COLLAPSIBLE CONTENT CONTAINER */}
        {isOpen && (
          <div style={{ padding: "0 28px 28px 28px" }}>
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
                    ? new Date(shipment.createdAt).toLocaleString()
                    : "-"}
                </div>
                <div className={styles.successStatus}>● Order Confirmed</div>
                <div>Order has been confirmed by Seller</div>
              </div>

              {/* ROW 2 */}
              <div className={styles.trackingRow}>
                <div>
                  {shipment?.pickedUpAt
                    ? new Date(shipment.pickedUpAt).toLocaleString()
                    : "Pending"}
                </div>
                <div
                  className={
                    shipment?.pickedUpAt
                      ? styles.activeStatus
                      : styles.pendingStatus
                  }
                >
                  ● Picked Up
                </div>
                <div>
                  {shipment?.pickedUpAt
                    ? "Shipment picked up by transporter"
                    : "Waiting for transporter pickup"}
                </div>
              </div>

              {/* ROW 3 */}
              <div className={styles.trackingRow}>
                <div>
                  {shipment?.deliveredAt
                    ? new Date(shipment.deliveredAt).toLocaleString()
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
        )}
      </div>

      {/* RIGHT SIDE: COLLAPSIBLE ACTIONS DROPDOWN */}
      <div className={styles.actionsSideCard} style={{ padding: "0", overflow: "hidden" }}>
        
        {/* ACCORDION HEADER BAR FOR ACTIONS */}
        <div 
          className={styles.cardAccordionHeader}
          onClick={() => setIsActionsOpen(!isActionsOpen)}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between", 
            padding: "24px 24px", 
            cursor: "pointer", 
            userSelect: "none" 
          }}
        >
          <h3 className={styles.sectionTitle} style={{ margin: "0" }}>
            Actions
          </h3>
          
          <div className={`${styles.toggleIconBtn} ${isActionsOpen ? styles.activeToggle : ""}`}>
            {isActionsOpen ? "−" : "+"}
          </div>
        </div>

        {/* DROPDOWN CONTAINER CONTENT */}
        {isActionsOpen && (
          <div style={{ padding: "0 24px 24px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* DOWNLOAD INVOICE */}
            <button className={styles.actionBtn} onClick={handleInvoiceDownload}>
              <FaFileInvoice />
              Download Invoice
              <FaDownload />
            </button>

            {/* DOWNLOAD WEIGHT TICKET */}
            <button className={styles.actionBtn} onClick={handleViewWeightTicket}>
              <FaWeightHanging />
              Download Weight-Ticket
              <FaDownload />
            </button>

            {/* SUPPORT */}
            <div className={styles.helpCard} style={{ margin: "0" }}>
              <h4>Need help?</h4>
              <p>If you have any issues with your shipment</p>
              <button className={styles.supportBtn}>
                <FaHeadset />
                Contact Support
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShipmentTrackingActionsSection;