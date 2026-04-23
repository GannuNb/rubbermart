// src/components/ProductOrderPanel.js

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBuilding, FaBarcode } from "react-icons/fa";
import styles from "../../styles/Buyer/ProductOrderPanel.module.css";
import AddressPopup from "./AddressPopup";
import AddressDropdown from "./AddressDropdown";

function ProductOrderPanel({ singleProduct }) {
  const navigate = useNavigate();

  const [buyerAddresses, setBuyerAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [requiredQuantity, setRequiredQuantity] = useState("");
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [saveAddressLoading, setSaveAddressLoading] = useState(false);
  const [buyerAddressesLoading, setBuyerAddressesLoading] = useState(true);
  const [buyerProfile, setBuyerProfile] = useState(null);

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
          },
        );

        const data = await response.json();

        if (response.ok) {
          setBuyerProfile(data.user);

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

          const shippingAddress = data.user?.businessProfile?.shippingAddress;

          if (
            shippingAddress &&
            !allAddresses.some(
              (address) => address.fullAddress === shippingAddress,
            )
          ) {
            allAddresses = [
              {
                fullName:
                  data.user?.fullName ||
                  data.user?.businessProfile?.companyName ||
                  "",

                mobileNumber:
                  data.user?.businessProfile?.phoneNumber ||
                  data.user?.phoneNumber ||
                  "",

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
        },
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

        setBuyerAddresses(updatedAddresses);

        const latestAddress = updatedAddresses[updatedAddresses.length - 1];

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

  const handleContinueToOrder = () => {
    const quantity = Number(requiredQuantity);

    if (!selectedAddress) {
      alert("Please select delivery address");
      return;
    }

    if (!quantity || quantity <= 0) {
      alert("Please enter valid quantity");
      return;
    }

    if (quantity > Number(singleProduct.quantity)) {
      alert("Required quantity cannot exceed available stock");
      return;
    }
    if (
      singleProduct.stockStatus !== "available" ||
      Number(singleProduct.quantity) <= 0
    ) {
      alert("This product is currently out of stock");
      return;
    }

    const selectedAddressObject =
      buyerAddresses.find(
        (address) => address.fullAddress?.trim() === selectedAddress?.trim(),
      ) || buyerAddresses[0];

    if (!selectedAddressObject) {
      alert("Selected address not found");
      return;
    }

    const orderData = {
      sellerId: singleProduct.seller?._id || "",
      sellerName: singleProduct.seller?.businessProfile?.companyName || "",
      shippingAddress: selectedAddressObject,
      buyerGstNumber: buyerProfile?.businessProfile?.gstNumber || "",
      businessProfile: buyerProfile?.businessProfile || {},
      orderItems: [
        {
          product: singleProduct._id || "",
          seller: singleProduct.seller?._id || "",
          category: singleProduct.category || "",
          application: singleProduct.application || "",
          requiredQuantity: quantity,
          pricePerMT: Number(singleProduct.pricePerMT || 0),
          subtotal: quantity * Number(singleProduct.pricePerMT || 0),
          loadingLocation: singleProduct.loadingLocation || "",
          hsnCode: singleProduct.hsnCode || "",
          productImage: singleProduct.images?.[0]?.image || "",
          availableQuantity: Number(singleProduct.quantity || 0),
        },
      ],
    };

    console.log("Order Data Sent:", orderData);

    navigate("/order-summary", {
      state: orderData,
    });
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
                  onClick={handleContinueToOrder}
                  disabled={
                    singleProduct.stockStatus !== "available" ||
                    Number(singleProduct.quantity) <= 0 ||
                    !selectedAddress ||
                    !requiredQuantity ||
                    Number(requiredQuantity) <= 0 ||
                    Number(requiredQuantity) > Number(singleProduct.quantity)
                  }
                >
                  {singleProduct.stockStatus !== "available" ||
                  Number(singleProduct.quantity) <= 0
                    ? "Currently Unavailable"
                    : "Continue To Order"}
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
