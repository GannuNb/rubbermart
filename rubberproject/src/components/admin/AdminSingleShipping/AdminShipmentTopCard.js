// src/components/admin/AdminSingleShipping/AdminShipmentTopCard.js

import React from "react";
import {
  FaFileInvoice,
  FaCalendarAlt,
  FaTruck,
  FaFileAlt,
} from "react-icons/fa";

import styles from "../../../styles/Admin/AdminSingleShippingInvoice.module.css";

const AdminShipmentTopCard = ({
  shipment,
  order,
}) => {
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN"
    );
  };

  const handleViewWeightTicket = () => {
    if (!shipment?.shipmentFile?.data) {
      alert("Weight ticket not found");
      return;
    }

    let base64 = "";

    try {
      if (
        typeof shipment.shipmentFile.data ===
        "string"
      ) {
        base64 =
          shipment.shipmentFile.data;
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

      const contentType =
        shipment?.shipmentFile
          ?.contentType ||
        "application/pdf";

      const fileUrl = `data:${contentType};base64,${base64}`;

      const newWindow =
        window.open();

      if (newWindow) {
        if (
          contentType.includes("pdf")
        ) {
          newWindow.document.write(`
            <iframe
              src="${fileUrl}"
              frameborder="0"
              style="width:100%;height:100vh;"
            ></iframe>
          `);
        } else {
          newWindow.document.write(`
            <img
              src="${fileUrl}"
              style="max-width:100%;height:auto;"
            />
          `);
        }
      }
    } catch (error) {
      console.log(error);
      alert(
        "Unable to open weight ticket"
      );
    }
  };

  return (
    <div className={styles.topCard}>
      {/* Invoice ID */}
      <div className={styles.topItem}>
        <div className={styles.iconBox}>
          <FaFileInvoice />
        </div>

        <div>
          <p className={styles.label}>
            Invoice ID
          </p>

          <h4 className={styles.linkValue}>
            {shipment?.shipmentInvoiceId ||
              "-"}
          </h4>
        </div>
      </div>

      {/* Shipment Date */}
      <div className={styles.topItem}>
        <div className={styles.iconBox}>
          <FaCalendarAlt />
        </div>

        <div>
          <p className={styles.label}>
            Shipment Date
          </p>

          <h4 className={styles.value}>
            {formatDate(
              shipment?.shippedAt
            )}
          </h4>
        </div>
      </div>

      {/* Seller Company */}
      <div className={styles.topItem}>
        <div className={styles.iconBox}>
          <FaTruck />
        </div>

        <div>
          <p className={styles.label}>
            Seller Company
          </p>

          <h4 className={styles.value}>
            {order?.seller
              ?.businessProfile
              ?.companyName ||
              order?.seller?.fullName ||
              order?.seller?._id ||
              "-"}
          </h4>
        </div>
      </div>

      {/* Weight Ticket */}
      <div className={styles.topItem}>
        <div className={styles.iconBox}>
          <FaFileAlt />
        </div>

        <button
          className={styles.fileBtn}
          onClick={
            handleViewWeightTicket
          }
        >
          View Weight Ticket
        </button>
      </div>
    </div>
  );
};

export default AdminShipmentTopCard;