import React from "react";

import { FaClipboardList, FaTruck } from "react-icons/fa";

import styles from "../../../styles/Buyer/BuyerSingleShippingInvoice.module.css";

const DriverShipmentSummarySection = ({ shipment }) => {
  const transporterAssigned =
    shipment?.transportStatus === "transporter_assigned";

  const transporter = shipment?.assignedTransporter;

  return (
    <div className={styles.driverSummaryWrapper}>
      {/* =========================
          LEFT SIDE
      ========================= */}

      <div className={styles.driverCard}>
        <div className={styles.cardHeading}>
          <FaTruck className={styles.headingIcon} />

          <h3>Transporter Details</h3>
        </div>

        <div className={styles.driverContent}>
          {/* IMAGE */}

          <div className={styles.driverImageBox}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="transporter"
              className={styles.driverImage}
            />
          </div>

          {/* =========================
              TRANSPORTER DETAILS
          ========================= */}

          {transporterAssigned ? (
            <div className={styles.driverInfo}>
              <div>
                <p className={styles.label}>Transporter Name</p>

                <h4>{transporter?.fullName || "-"}</h4>
              </div>

              <div>
                <p className={styles.label}>Company Name</p>

                <h4>{transporter?.businessProfile?.companyName || "-"}</h4>
              </div>

              <div>
                <p className={styles.label}>Mobile Number</p>

                <h4>{transporter?.mobile || "-"}</h4>
              </div>

              <div>
                <p className={styles.label}>GST Number</p>

                <h4>{transporter?.businessProfile?.gstNumber || "-"}</h4>
              </div>

              <div>
                <p className={styles.label}>Transport Status</p>

                <h4>
                  {shipment?.transportStatus?.replaceAll("_", " ") || "-"}
                </h4>
              </div>
            </div>
          ) : (
            <div className={styles.driverInfo}>
              <div>
                <p className={styles.label}>Transport Status</p>

                <h4>Waiting For Transporter Assignment</h4>
              </div>
            </div>
          )}
        </div>

        {/* CONTACT BUTTON */}

        {transporterAssigned && (
          <button className={styles.contactDriverBtn}>
            Contact Transporter
          </button>
        )}
      </div>

      {/* =========================
          RIGHT SIDE
      ========================= */}

      <div className={styles.shipmentSummaryCard}>
        <div className={styles.cardHeading}>
          <FaClipboardList className={styles.headingIcon} />

          <h3>Shipment Summary</h3>
        </div>

        <div className={styles.shipmentSummaryContent}>
          <div className={styles.summaryRow}>
            <p>Items in Shipment</p>

            <h4>
              {shipment?.selectedSubProducts?.length > 0
                ? shipment.selectedSubProducts.length
                : 1}{" "}
              Item
              {shipment?.selectedSubProducts?.length > 1 ? "s" : ""}
            </h4>
          </div>

          <div className={styles.summaryRow}>
            <p>Shipped Quantity</p>

            <h4>{shipment?.shippedQuantity || 0} MT</h4>
          </div>

          <div className={styles.addressBox}>
            <h4 className={styles.addressTitle}>Shipping Address</h4>

            <div className={styles.addressRow}>
              <p>Delivery Location</p>

              <span>{shipment?.shipmentTo || "-"}</span>
            </div>

            <div className={styles.addressRow}>
              <p>Pickup Location</p>

              <span>{shipment?.shipmentFrom || "-"}</span>
            </div>

            <div className={styles.addressRow}>
              <p>Transport Type</p>

              <span>Marketplace Transport</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverShipmentSummarySection;
