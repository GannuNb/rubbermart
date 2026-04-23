import React from "react";
import styles from "../../styles/Seller/SellerShipmentForm.module.css";

const ShipmentQuantityInfo = ({
  shippedQuantity,
  onChange,
  selectedOrderItem,
  alreadyShippedQuantity,
  remainingQuantity,
}) => {
  return (
    <div className={styles.field}>
      <label>Shipped Quantity</label>

      <input
        type="number"
        name="shippedQuantity"
        value={shippedQuantity}
        onChange={onChange}
        placeholder="Enter shipped quantity"
      />

      {selectedOrderItem && (
        <div className={styles.quantityInfo}>
          <small className={styles.helperText}>
            Ordered Quantity: {selectedOrderItem.requiredQuantity}
          </small>

          <small className={styles.helperText}>
            Already Shipped: {alreadyShippedQuantity}
          </small>

          <small className={styles.helperText}>
            Remaining Quantity: {remainingQuantity}
          </small>
        </div>
      )}
    </div>
  );
};

export default ShipmentQuantityInfo;