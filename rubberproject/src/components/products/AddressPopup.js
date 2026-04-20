// src/components/AddressPopup.js

import React from "react";
import { FaTimes } from "react-icons/fa";
import styles from "../../styles/Buyer/ProductOrderPanel.module.css";

function AddressPopup({
  showAddressPopup,
  setShowAddressPopup,
  addressForm,
  handleInputChange,
  handleSaveAddress,
  saveAddressLoading,
}) {
  if (!showAddressPopup) return null;

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupCard}>
        <div className={styles.popupHeader}>
          <h3>Add New Address</h3>

          <button
            type="button"
            className={styles.closePopupBtn}
            onClick={() => setShowAddressPopup(false)}
          >
            <FaTimes />
          </button>
        </div>

        <div className={styles.popupGrid}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            className={styles.selectInput}
            value={addressForm.fullName}
            onChange={handleInputChange}
          />

          <input
            type="text"
            name="mobileNumber"
            placeholder="Mobile Number"
            className={styles.selectInput}
            value={addressForm.mobileNumber}
            onChange={handleInputChange}
          />

          <input
            type="text"
            name="flatHouse"
            placeholder="Flat / House No / Building"
            className={styles.selectInput}
            value={addressForm.flatHouse}
            onChange={handleInputChange}
          />

          <input
            type="text"
            name="areaStreet"
            placeholder="Area / Street / Colony"
            className={styles.selectInput}
            value={addressForm.areaStreet}
            onChange={handleInputChange}
          />

          <input
            type="text"
            name="landmark"
            placeholder="Landmark"
            className={styles.selectInput}
            value={addressForm.landmark}
            onChange={handleInputChange}
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            className={styles.selectInput}
            value={addressForm.city}
            onChange={handleInputChange}
          />

          <input
            type="text"
            name="state"
            placeholder="State"
            className={styles.selectInput}
            value={addressForm.state}
            onChange={handleInputChange}
          />

          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            className={styles.selectInput}
            value={addressForm.pincode}
            onChange={handleInputChange}
          />
        </div>

        <button
          type="button"
          className={styles.buyButton}
          onClick={handleSaveAddress}
          disabled={saveAddressLoading}
        >
          {saveAddressLoading ? "Saving Address..." : "Save Address"}
        </button>
      </div>
    </div>
  );
}

export default AddressPopup;