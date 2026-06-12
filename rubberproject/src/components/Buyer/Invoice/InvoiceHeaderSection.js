import React from "react";
import {
  FaFileInvoice,
  FaCalendarAlt,
  FaTruck,
  FaFileAlt,
  FaDownload,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { downloadShippingInvoiceThunk } from "../../../redux/slices/buyerOrderThunk";
import styles from "../../../styles/Buyer/BuyerSingleShippingInvoice.module.css";

const InvoiceHeaderSection = ({ shipment, order }) => {
  const dispatch = useDispatch();

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

      /*
    =========================================
    CONVERT BASE64 TO BLOB
    =========================================
    */

      const byteCharacters = atob(base64);

      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      const blob = new Blob([byteArray], {
        type: shipment.weightTicket.contentType || "application/pdf",
      });

      /*
    =========================================
    OPEN BLOB URL
    =========================================
    */

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

  const handleInvoiceDownload = () => {
    dispatch(downloadShippingInvoiceThunk(order._id, shipment._id));
  };

  return (
    <>
      {/* TOP TITLE SECTION */}
      <div className={styles.shippingTitleRow}>
        <div>
          <h2 className={styles.mainTitle}>Shipping Details</h2>

          <p className={styles.subTitle}>
            Complete Shipment Information and Tracking Details
          </p>
        </div>

        <div className={styles.orderIdBadge}>
          <span>Order ID :</span>
          <strong>{order?.orderId || "-"}</strong>
        </div>
      </div>

      {/* HEADER WHITE CARD */}
      <div className={styles.headerCard}>
        <div className={styles.headerGrid}>
          {/* Invoice ID */}
          <div className={styles.headerItem}>
            <div className={styles.iconBox}>
              <FaFileInvoice />
            </div>

            <div>
              <p className={styles.label}>Invoice ID</p>
              <h4>{shipment?.shipmentInvoiceId || "-"}</h4>
            </div>
          </div>

          {/* Shipment Date */}
          <div className={styles.headerItem}>
            <div className={styles.iconBox}>
              <FaCalendarAlt />
            </div>

            <div>
              <p className={styles.label}>Picked Up Date</p>

              <h4>
                {shipment?.pickedUpAt
                  ? new Date(shipment.pickedUpAt).toLocaleDateString()
                  : "Pending"}
              </h4>
            </div>
          </div>

          {/* Shipped By */}
          <div className={styles.headerItem}>
            <div className={styles.iconBox}>
              <FaTruck />
            </div>

            <div>
              <p className={styles.label}>Shipped By</p>

              <h4>
                {order?.seller?.businessProfile?.companyName ||
                  order?.seller?.fullName ||
                  "-"}
              </h4>
            </div>
          </div>

          {/* Invoice PDF */}
          <div
            className={styles.headerItem}
            onClick={handleInvoiceDownload}
            style={{ cursor: "pointer" }}
          >
            <div className={styles.iconBox}>
              <FaFileInvoice />
            </div>

            <div className={styles.weightTicketBox}>
              <p className={styles.label}>Invoice</p>

              <div className={styles.weightTicketRow}>
                <h4 className={styles.weightTicketText}>Invoice PDF</h4>

                <FaDownload className={styles.downloadIcon} />
              </div>
            </div>
          </div>

          {/* Weight Ticket */}
          <div
            className={styles.headerItem}
            onClick={handleViewWeightTicket}
            style={{ cursor: "pointer" }}
          >
            <div className={styles.iconBox}>
              <FaFileAlt />
            </div>

            <div className={styles.weightTicketBox}>
              <p className={styles.label}>Documents</p>

              <div className={styles.weightTicketRow}>
                <h4 className={styles.weightTicketText}>Weight Ticket</h4>

                <FaDownload className={styles.downloadIcon} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceHeaderSection;
