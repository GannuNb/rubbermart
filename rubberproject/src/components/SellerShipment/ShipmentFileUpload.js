import React from "react";
import styles from "../../styles/Seller/SellerShipmentForm.module.css";

const ShipmentFileUpload = ({
  fileInputRef,
  handleChange,
}) => {
  return (
    <div className={styles.field}>
      <label>Upload Weight Ticket</label>

      <input
        ref={fileInputRef}
        type="file"
        name="shipmentFile"
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={handleChange}
      />
    </div>
  );
};

export default ShipmentFileUpload;