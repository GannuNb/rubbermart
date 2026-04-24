import React from "react";
import { FaUserAlt, FaClipboardList } from "react-icons/fa";
import styles from "../../../styles/Buyer/BuyerSingleShippingInvoice.module.css";

const DriverShipmentSummarySection = ({ shipment }) => {
  return (
    <div className={styles.driverSummaryWrapper}>
      {/* LEFT SIDE - DRIVER DETAILS */}
      <div className={styles.driverCard}>
        <div className={styles.cardHeading}>
          <FaUserAlt className={styles.headingIcon} />
          <h3>Driver Details</h3>
        </div>

        <div className={styles.driverContent}>
          {/* DRIVER IMAGE */}
          <div className={styles.driverImageBox}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="driver"
              className={styles.driverImage}
            />
          </div>

          {/* DRIVER INFO */}
          <div className={styles.driverInfo}>
            <div>
              <p className={styles.label}>Driver Name</p>
              <h4>{shipment?.driverName || "-"}</h4>
            </div>

            <div>
              <p className={styles.label}>Driver Number</p>
              <h4>{shipment?.driverMobile || "-"}</h4>
            </div>

            <div>
              <p className={styles.label}>Vehicle Number</p>
              <h4>{shipment?.vehicleNumber || "-"}</h4>
            </div>
          </div>
        </div>

        <button className={styles.contactDriverBtn}>
          Contact Driver
        </button>
      </div>

      {/* RIGHT SIDE - SHIPMENT SUMMARY */}
      <div className={styles.shipmentSummaryCard}>
        <div className={styles.cardHeading}>
          <FaClipboardList className={styles.headingIcon} />
          <h3>Shipment Summary</h3>
        </div>

        <div className={styles.shipmentSummaryContent}>
          <div className={styles.summaryRow}>
            <p>Items in Shipment</p>
            <h4>1 Item</h4>
          </div>

          <div className={styles.summaryRow}>
            <p>Shipped Quantity</p>
            <h4>{shipment?.shippedQuantity || 0} MT</h4>
          </div>

          <div className={styles.addressBox}>
            <h4 className={styles.addressTitle}>
              Shipping Address
            </h4>

            <div className={styles.addressRow}>
              <p>Name</p>
              <span>{shipment?.driverName || "-"}</span>
            </div>

            <div className={styles.addressRow}>
              <p>Phone Number</p>
              <span>{shipment?.driverMobile || "-"}</span>
            </div>

            <div className={styles.addressRow}>
              <p>Address</p>
              <span>{shipment?.shipmentTo || "-"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverShipmentSummarySection;