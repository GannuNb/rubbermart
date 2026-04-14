// src/components/ProductOrderPanel.js

import React, { useEffect, useState } from "react";
import { FaBuilding, FaBarcode } from "react-icons/fa";
import styles from "../styles/ProductOrderPanel.module.css";
import AddressPopup from "./AddressPopup";
import AddressDropdown from "./AddressDropdown";

function ProductOrderPanel({ singleProduct }) {
  const [buyerAddresses, setBuyerAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [requiredQuantity, setRequiredQuantity] = useState("");
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [saveAddressLoading, setSaveAddressLoading] = useState(false);
  const [buyerAddressesLoading, setBuyerAddressesLoading] = useState(true);

  const [addressForm, setAddressForm] = useState({
    fullName: "",
    mobileNumber: "",
    flatHouse: "",
    areaStreet: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    const fetchBuyerAddresses = async () => {
      try {
        setBuyerAddressesLoading(true);

        const token = localStorage.getItem("token");

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          let allAddresses = (data.user?.addresses || []).map((address) => ({
            ...address,
            fullAddress:
              address.fullAddress ||
              `${address.flatHouse || ""}${
                address.areaStreet ? `, ${address.areaStreet}` : ""
              }${address.landmark ? `, ${address.landmark}` : ""}${
                address.city ? `, ${address.city}` : ""
              }${address.state ? `, ${address.state}` : ""}${
                address.pincode ? ` - ${address.pincode}` : ""
              }`,
          }));

          const shippingAddress =
            data.user?.businessProfile?.shippingAddress;

          if (
            shippingAddress &&
            !allAddresses.some(
              (address) => address.fullAddress === shippingAddress
            )
          ) {
            allAddresses = [
              {
                fullName: data.user.fullName,
                mobileNumber: "",
                flatHouse: "",
                areaStreet: "",
                landmark: "",
                city: "",
                state: "",
                pincode: "",
                fullAddress: shippingAddress,
              },
              ...allAddresses,
            ];
          }

          setBuyerAddresses(allAddresses);

          if (allAddresses.length > 0) {
            setSelectedAddress(allAddresses[0].fullAddress);
          }
        }
      } catch (error) {
        console.log("Fetch Buyer Addresses Error:", error);
      } finally {
        setBuyerAddressesLoading(false);
      }
    };

    fetchBuyerAddresses();
  }, []);

  const handleInputChange = (e) => {
    setAddressForm({
      ...addressForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveAddress = async () => {
    try {
      setSaveAddressLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/user/add-address`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(addressForm),
        }
      );

      const data = await response.json();

      if (response.ok) {
        let updatedAddresses = (data.addresses || []).map((address) => ({
          ...address,
          fullAddress:
            address.fullAddress ||
            `${address.flatHouse || ""}${
              address.areaStreet ? `, ${address.areaStreet}` : ""
            }${address.landmark ? `, ${address.landmark}` : ""}${
              address.city ? `, ${address.city}` : ""
            }${address.state ? `, ${address.state}` : ""}${
              address.pincode ? ` - ${address.pincode}` : ""
            }`,
        }));

        const profileResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/api/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const profileData = await profileResponse.json();

        const shippingAddress =
          profileData.user?.businessProfile?.shippingAddress;

        if (
          shippingAddress &&
          !updatedAddresses.some(
            (address) => address.fullAddress === shippingAddress
          )
        ) {
          updatedAddresses = [
            {
              fullName: profileData.user.fullName,
              mobileNumber: "",
              flatHouse: "",
              areaStreet: "",
              landmark: "",
              city: "",
              state: "",
              pincode: "",
              fullAddress: shippingAddress,
            },
            ...updatedAddresses,
          ];
        }

        setBuyerAddresses(updatedAddresses);

        const latestAddress =
          updatedAddresses[updatedAddresses.length - 1];

        if (latestAddress?.fullAddress) {
          setSelectedAddress(latestAddress.fullAddress);
        }

        setAddressForm({
          fullName: "",
          mobileNumber: "",
          flatHouse: "",
          areaStreet: "",
          landmark: "",
          city: "",
          state: "",
          pincode: "",
        });

        setShowAddressPopup(false);
      } else {
        alert(data.message || "Failed to save address");
      }
    } catch (error) {
      console.log("Save Address Error:", error);
      alert("Failed to save address");
    } finally {
      setSaveAddressLoading(false);
    }
  };

  return (
    <>
      <div className={styles.sidePanelWrapper}>
        <div className={styles.businessCard}>
          <h3>Seller Business Profile</h3>

          <div className={styles.businessBox}>
            <FaBuilding className={styles.cardIcon} />
            <div>
              <span>Company Name</span>
              <h4>
                {singleProduct.seller?.businessProfile?.companyName ||
                  "Not Available"}
              </h4>
            </div>
          </div>

          <div className={styles.businessBox}>
            <FaBarcode className={styles.cardIcon} />
            <div>
              <span>Company ID</span>
              <h4>
                {singleProduct.seller?.businessProfile?.companyId ||
                  "Not Available"}
              </h4>
            </div>
          </div>

          <div className={styles.stockInfo}>
            {singleProduct.stockStatus === "available"
              ? "Product In Stock"
              : "Currently Out Of Stock"}
          </div>
        </div>

        <div className={styles.orderCard}>
          <h3>Order Details</h3>

          <AddressDropdown
            buyerAddresses={buyerAddresses}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
            buyerAddressesLoading={buyerAddressesLoading}
          />

          <button
            type="button"
            className={styles.addAddressBtn}
            onClick={() => setShowAddressPopup(true)}
          >
            + Add New Address
          </button>

          <div className={styles.quantitySection}>
            <label>Required Quantity (MT)</label>

            <input
              type="number"
              min="1"
              max={singleProduct.quantity}
              placeholder="Enter required quantity"
              className={styles.quantityInput}
              value={requiredQuantity}
              onChange={(e) => setRequiredQuantity(e.target.value)}
            />

            {requiredQuantity > singleProduct.quantity && (
              <p className={styles.quantityError}>
                Required quantity cannot exceed available stock.
              </p>
            )}
          </div>

          <button
            className={styles.buyButton}
            disabled={
              !selectedAddress ||
              !requiredQuantity ||
              Number(requiredQuantity) <= 0 ||
              Number(requiredQuantity) > Number(singleProduct.quantity)
            }
          >
            Continue To Order
          </button>
        </div>
      </div>

      <AddressPopup
        showAddressPopup={showAddressPopup}
        setShowAddressPopup={setShowAddressPopup}
        addressForm={addressForm}
        handleInputChange={handleInputChange}
        handleSaveAddress={handleSaveAddress}
        saveAddressLoading={saveAddressLoading}
      />
    </>
  );
}

export default ProductOrderPanel;