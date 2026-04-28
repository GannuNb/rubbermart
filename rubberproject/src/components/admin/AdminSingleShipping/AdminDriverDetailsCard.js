import React from "react";
import {
  FaUser,
  FaPhone,
  FaTruck,
  FaMapMarkerAlt,
} from "react-icons/fa";

import styles from "../../../styles/Admin/AdminSingleShippingInvoice.module.css";

const AdminDriverDetailsCard = ({
  shipment,
}) => {
  return (
    <div className={styles.infoCard}>
      <h3 className={styles.cardTitle}>
        Driver & Vehicle Details
      </h3>

      <div className={styles.infoList}>
        {/* Driver Name */}
        <div className={styles.infoRow}>
          <FaUser />

          <div>
            <p className={styles.label}>
              Driver Name
            </p>

            <h4 className={styles.value}>
              {shipment?.driverName ||
                "-"}
            </h4>
          </div>
        </div>

        {/* Mobile */}
        <div className={styles.infoRow}>
          <FaPhone />

          <div>
            <p className={styles.label}>
              Driver Mobile
            </p>

            <h4 className={styles.value}>
              {shipment?.driverMobile ||
                "-"}
            </h4>
          </div>
        </div>

        {/* Vehicle */}
        <div className={styles.infoRow}>
          <FaTruck />

          <div>
            <p className={styles.label}>
              Vehicle Number
            </p>

            <h4 className={styles.value}>
              {shipment?.vehicleNumber ||
                "-"}
            </h4>
          </div>
        </div>

        {/* Route */}
        <div className={styles.infoRow}>
          <FaMapMarkerAlt />

          <div>
            <p className={styles.label}>
              Shipment Route
            </p>

            <h4 className={styles.value}>
              {shipment?.shipmentFrom ||
                "-"}
              {" → "}
              {shipment?.shipmentTo ||
                "-"}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDriverDetailsCard;