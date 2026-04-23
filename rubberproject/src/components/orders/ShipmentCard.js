import React from "react";
import styles from "../../styles/Seller/ShipmentCard.module.css";

const ShipmentCard = ({ shipment }) => {
  const shipmentFileUrl =
    shipment?.shipmentFile?.data?.data &&
    shipment?.shipmentFile?.contentType
      ? `data:${shipment.shipmentFile.contentType};base64,${btoa(
          new Uint8Array(shipment.shipmentFile.data.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        )}`
      : null;

  return (
    <div className={styles.card}>
      <div className={styles.row}>
        <span>Shipment Invoice ID</span>
        <strong>{shipment.shipmentInvoiceId || "N/A"}</strong>
      </div>

      <div className={styles.row}>
        <span>Selected Item</span>
        <strong>{shipment.selectedItem || "N/A"}</strong>
      </div>

      <div className={styles.row}>
        <span>Vehicle Number</span>
        <strong>{shipment.vehicleNumber || "N/A"}</strong>
      </div>

      <div className={styles.row}>
        <span>Driver Name</span>
        <strong>{shipment.driverName || "N/A"}</strong>
      </div>

      <div className={styles.row}>
        <span>Driver Contact</span>
        <strong>{shipment.driverMobile || "N/A"}</strong>
      </div>

      <div className={styles.row}>
        <span>Shipped Quantity</span>
        <strong>{shipment.shippedQuantity || 0}</strong>
      </div>

      <div className={styles.row}>
        <span>Shipment From</span>
        <strong>{shipment.shipmentFrom || "N/A"}</strong>
      </div>

      <div className={styles.row}>
        <span>Shipment To</span>
        <strong>{shipment.shipmentTo || "N/A"}</strong>
      </div>

      <div className={styles.row}>
        <span>Status</span>
        <strong>{shipment.shipmentStatus || "pending"}</strong>
      </div>

      {shipment.selectedSubProducts?.length > 0 && (
        <div className={styles.subProducts}>
          <span>Selected Sub Products</span>

          <div className={styles.tags}>
            {shipment.selectedSubProducts.map((subProduct, index) => (
              <div key={index} className={styles.tag}>
                {subProduct}
              </div>
            ))}
          </div>
        </div>
      )}

      {shipmentFileUrl && (
        <a
          href={shipmentFileUrl}
          target="_blank"
          rel="noreferrer"
          className={styles.viewButton}
        >
          View Weight Ticket
        </a>
      )}
    </div>
  );
};

export default ShipmentCard;