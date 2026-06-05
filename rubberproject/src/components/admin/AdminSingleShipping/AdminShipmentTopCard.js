// src/components/admin/AdminSingleShipping/AdminShipmentTopCard.js

import React from "react";

import {
  FaFileInvoice,
  FaCalendarAlt,
  FaTruck,
  FaFileAlt,
  FaImage,
} from "react-icons/fa";

import styles from "../../../styles/Admin/AdminSingleShippingInvoice.module.css";

const AdminShipmentTopCard = ({ shipment, order }) => {
  /* =========================
     FORMAT DATE
  ========================= */

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN");
  };

  /* =========================
     OPEN FILE
  ========================= */

  const openFile = (file, fileName) => {
    if (!file?.data) {
      alert(`${fileName} not found`);

      return;
    }

    let base64 = "";

    try {
      /* STRING */

      if (typeof file.data === "string") {
        base64 = file.data;
      } else if (file.data?.data) {
        /* BUFFER */
        base64 = btoa(
          new Uint8Array(file.data.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            "",
          ),
        );
      }

      const contentType = file.contentType || "application/pdf";

      const fileUrl = `data:${contentType};base64,${base64}`;

      const newWindow = window.open();

      if (newWindow) {
        /* PDF */

        if (contentType.includes("pdf")) {
          newWindow.document.write(`
            <iframe
              src="${fileUrl}"
              frameborder="0"
              style="width:100%;height:100vh;"
            ></iframe>
          `);
        } else {
          /* IMAGE */
          newWindow.document.write(`
            <div
              style="
                display:flex;
                justify-content:center;
                align-items:center;
                height:100vh;
                background:#f5f5f5;
              "
            >
              <img
                src="${fileUrl}"
                style="
                  max-width:100%;
                  max-height:100vh;
                  object-fit:contain;
                "
              />
            </div>
          `);
        }
      }
    } catch (error) {
      console.log(error);

      alert(`Unable to open ${fileName}`);
    }
  };

  return (
    <div className={styles.topCard}>
      {/* =========================
          INVOICE ID
      ========================= */}

      <div className={styles.topItem}>
        <div className={styles.iconBox}>
          <FaFileInvoice />
        </div>

        <div>
          <p className={styles.label}>Invoice ID</p>

          <h4 className={styles.linkValue}>
            {shipment?.shipmentInvoiceId || "-"}
          </h4>
        </div>
      </div>

      {/* =========================
          SHIPMENT DATE
      ========================= */}

      <div className={styles.topItem}>
        <div className={styles.iconBox}>
          <FaCalendarAlt />
        </div>

        <div>
          <p className={styles.label}>Shipment Date</p>

          <h4 className={styles.value}>{formatDate(shipment?.packedAt)}</h4>
        </div>
      </div>

      {/* =========================
          SELLER COMPANY
      ========================= */}

      <div className={styles.topItem}>
        <div className={styles.iconBox}>
          <FaTruck />
        </div>

        <div>
          <p className={styles.label}>Seller Company</p>

          <h4 className={styles.value}>
            {order?.seller?.businessProfile?.companyName ||
              order?.seller?.fullName ||
              "-"}
          </h4>
        </div>
      </div>

      {/* =========================
          WEIGHT TICKET
      ========================= */}

      <div className={styles.topItem}>
        <div className={styles.iconBox}>
          <FaFileAlt />
        </div>

        <button
          className={styles.fileBtn}
          onClick={() => openFile(shipment?.weightTicket, "Weight Ticket")}
        >
          View Weight Ticket
        </button>
      </div>

      {/* =========================
          PACKED ITEM PHOTO
      ========================= */}

      <div className={styles.topItem}>
        <div className={styles.iconBox}>
          <FaImage />
        </div>

        <button
          className={styles.fileBtn}
          onClick={() =>
            openFile(shipment?.packedItemPhoto, "Packed Item Photo")
          }
        >
          View Packed Photo
        </button>
      </div>
    </div>
  );
};

export default AdminShipmentTopCard;
