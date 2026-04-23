import React from "react";
import styles from "../../styles/Seller/SellerShipmentForm.module.css";

const ShipmentAddressField = ({
  formData,
  handleChange,
  handleShipmentFromChange,
  shipmentFromOptions,
  shipmentTo,
  setFormData,
}) => {
  return (
    <>
      <div className={styles.field}>
        <label>Shipment From</label>

        {formData.shipmentFromType === "custom" ? (
          <>
            <textarea
              name="shipmentFrom"
              value={formData.shipmentFrom}
              onChange={handleChange}
              placeholder="Enter custom shipment from address"
              rows="3"
            />

            <button
              type="button"
              className={styles.switchButton}
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  shipmentFrom: "",
                  shipmentFromType: "",
                }))
              }
            >
              Select From Saved Addresses
            </button>
          </>
        ) : (
          <select
            value={formData.shipmentFrom}
            onChange={handleShipmentFromChange}
          >
            <option value="">Select Shipment From Address</option>

            {shipmentFromOptions.map((address, index) => (
              <option key={index} value={address}>
                {address}
              </option>
            ))}

            <option value="custom">Enter Custom Address</option>
          </select>
        )}
      </div>

      <div className={styles.field}>
        <label>Shipment To</label>

        <input type="text" value={shipmentTo} readOnly />
      </div>
    </>
  );
};

export default ShipmentAddressField;