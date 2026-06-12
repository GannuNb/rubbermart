import React from "react";

import { FaUserAlt, FaClipboardList, FaTruck } from "react-icons/fa";

import styles from "../../../styles/Buyer/BuyerSingleShippingInvoice.module.css";

const DriverShipmentSummarySection = ({ shipment }) => {
  const isMarketplaceTransport =
    shipment?.transportMode === "marketplace_transport";

  const transporter = shipment?.assignedTransporter;

  return (
    <div className={styles.driverSummaryWrapper}>
      {/* =========================
          LEFT SIDE
      ========================= */}

      <div className={styles.driverCard}>
        <div className={styles.cardHeading}>
          {isMarketplaceTransport ? (
            <FaTruck className={styles.headingIcon} />
          ) : (
            <FaUserAlt className={styles.headingIcon} />
          )}

          <h3>
            {isMarketplaceTransport ? "Transporter Details" : "Driver Details"}
          </h3>
        </div>

        <div className={styles.driverContent}>
          {/* IMAGE */}

          <div className={styles.driverImageBox}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="driver"
              className={styles.driverImage}
            />
          </div>

          {/* =========================
              MARKETPLACE TRANSPORT
          ========================= */}

          {isMarketplaceTransport ? (
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
                <p className={styles.label}>Phone Number</p>

                <h4>{transporter?.businessProfile?.phoneNumber || "-"}</h4>
              </div>

              <div>
                <p className={styles.label}>GST Number</p>

                <h4>{transporter?.businessProfile?.gstNumber || "-"}</h4>
              </div>

              <div>
                <p className={styles.label}>Vehicle Number</p>

                <h4>{shipment?.vehicleNumber || "-"}</h4>
              </div>
            </div>
          ) : (
            /* =========================
                MANUAL DRIVER
            ========================= */

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
          )}
        </div>

        {/* CONTACT BUTTON */}

        <button className={styles.contactDriverBtn}>
          {isMarketplaceTransport ? "Contact Transporter" : "Contact Driver"}
        </button>
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

            <h4>1 Item</h4>
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

              <span>
                {isMarketplaceTransport
                  ? "Marketplace Transport"
                  : "Manual Transport"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverShipmentSummarySection;
