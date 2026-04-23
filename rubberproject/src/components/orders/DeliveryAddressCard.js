import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import styles from "../../styles/Buyer/BuyerOrderDetails.module.css";

function DeliveryAddressCard({ order }) {
  const address = order?.shippingAddress;

  if (!address) return null;

  return (
    <div className={styles.addressCard}>
      <h3 className={styles.cardTitle}>Delivery Address</h3>

      <div className={styles.addressBox}>
        <div className={styles.iconBox}>
          <FaMapMarkerAlt />
        </div>

        <div className={styles.addressContent}>
          <h4>{address.fullName}</h4>

          <p>{address.fullAddress}</p>

          {address.mobileNumber && (
            <p className={styles.phone}>
              📞 {address.mobileNumber}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DeliveryAddressCard;