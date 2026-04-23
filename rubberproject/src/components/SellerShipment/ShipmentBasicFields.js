import React from "react";
import styles from "../../styles/Seller/SellerShipmentForm.module.css";

const ShipmentBasicFields = ({
  formData,
  handleChange,
}) => {
  return (
    <>
      <div className={styles.field}>
        <label>Vehicle Number</label>

        <input
          type="text"
          name="vehicleNumber"
          value={formData.vehicleNumber}
          onChange={handleChange}
          placeholder="Enter vehicle number"
        />
      </div>

      <div className={styles.field}>
        <label>Driver Name</label>

        <input
          type="text"
          name="driverName"
          value={formData.driverName}
          onChange={handleChange}
          placeholder="Enter driver name"
        />
      </div>

      <div className={styles.field}>
        <label>Driver Contact</label>

        <input
          type="text"
          name="driverMobile"
          value={formData.driverMobile}
          onChange={handleChange}
          placeholder="Enter driver mobile"
        />
      </div>
    </>
  );
};

export default ShipmentBasicFields;