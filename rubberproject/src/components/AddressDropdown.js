// src/components/AddressDropdown.js

import React from "react";
import styles from "../styles/ProductOrderPanel.module.css";

function AddressDropdown({
  buyerAddresses,
  selectedAddress,
  setSelectedAddress,
  buyerAddressesLoading,
}) {
  return (
    <div className={styles.addressSection}>
      <label>Select Delivery Address</label>

      <div className={styles.dropdownWrapper}>
        <select
          className={styles.addressDropdown}
          value={selectedAddress}
          onChange={(e) => setSelectedAddress(e.target.value)}
        >
          <option value="">
            {buyerAddressesLoading
              ? "Loading addresses..."
              : "Select Address"}
          </option>

          {buyerAddresses.map((address, index) => {
            const fullAddress =
              address.fullAddress ||
              `${address.flatHouse || ""}${
                address.areaStreet ? `, ${address.areaStreet}` : ""
              }${address.landmark ? `, ${address.landmark}` : ""}${
                address.city ? `, ${address.city}` : ""
              }${address.state ? `, ${address.state}` : ""}${
                address.pincode ? ` - ${address.pincode}` : ""
              }`;

            return (
              <option key={index} value={fullAddress}>
                {address.fullName} - {fullAddress}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}

export default AddressDropdown;