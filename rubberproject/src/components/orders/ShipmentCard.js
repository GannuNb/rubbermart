import React from "react";
import styles from "../../styles/Seller/ShipmentCard.module.css";

const ShipmentCard = ({ shipment }) => {
  /* =========================
     VIEW SHIPMENT FILE
  ========================= */

  const handleViewShipmentFile = (file) => {
    if (!file || !file.data) {
      alert("Shipment file not found");
      return;
    }

    try {
      const byteArray = file.data.data;

      if (
        !byteArray ||
        !Array.isArray(byteArray)
      ) {
        alert("Invalid shipment file data");
        return;
      }

      const uint8Array =
        new Uint8Array(byteArray);

      const blob = new Blob(
        [uint8Array],
        {
          type:
            file.contentType ||
            "application/pdf",
        }
      );

      const fileURL =
        window.URL.createObjectURL(blob);

      window.open(fileURL, "_blank");
    } catch (error) {
      console.log(
        "View Shipment File Error:",
        error
      );
      alert("Failed to open shipment file");
    }
  };

  return (
    <div className={styles.card}>
      {/* Shipment Invoice ID */}

      <div className={styles.row}>
        <span>Shipment Invoice ID</span>
        <strong>
          {shipment.shipmentInvoiceId ||
            "N/A"}
        </strong>
      </div>

      {/* Selected Item */}

      <div className={styles.row}>
        <span>Selected Item</span>
        <strong>
          {shipment.selectedItem || "N/A"}
        </strong>
      </div>

      {/* Vehicle Number */}

      <div className={styles.row}>
        <span>Vehicle Number</span>
        <strong>
          {shipment.vehicleNumber || "N/A"}
        </strong>
      </div>

      {/* Driver Name */}

      <div className={styles.row}>
        <span>Driver Name</span>
        <strong>
          {shipment.driverName || "N/A"}
        </strong>
      </div>

      {/* Driver Contact */}

      <div className={styles.row}>
        <span>Driver Contact</span>
        <strong>
          {shipment.driverMobile || "N/A"}
        </strong>
      </div>

      {/* Shipped Quantity */}

      <div className={styles.row}>
        <span>Shipped Quantity</span>
        <strong>
          {shipment.shippedQuantity || 0}
        </strong>
      </div>

      {/* Shipment From */}

      <div className={styles.row}>
        <span>Shipment From</span>
        <strong>
          {shipment.shipmentFrom || "N/A"}
        </strong>
      </div>

      {/* Shipment To */}

      <div className={styles.row}>
        <span>Shipment To</span>
        <strong>
          {shipment.shipmentTo || "N/A"}
        </strong>
      </div>

      {/* Shipment Status */}

      <div className={styles.row}>
        <span>Status</span>
        <strong>
          {shipment.shipmentStatus ||
            "pending"}
        </strong>
      </div>

      {/* Selected Sub Products */}

      {shipment.selectedSubProducts
        ?.length > 0 && (
        <div
          className={styles.subProducts}
        >
          <span>
            Selected Sub Products
          </span>

          <div className={styles.tags}>
            {shipment.selectedSubProducts.map(
              (subProduct, index) => (
                <div
                  key={index}
                  className={styles.tag}
                >
                  {subProduct}
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* View Weight Ticket */}

      {shipment?.shipmentFile?.data && (
        <button
          type="button"
          className={styles.viewButton}
          onClick={() =>
            handleViewShipmentFile(
              shipment.shipmentFile
            )
          }
        >
          View Weight Ticket
        </button>
      )}
    </div>
  );
};

export default ShipmentCard;