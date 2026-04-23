import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addShipmentToOrderThunk } from "../../redux/slices/sellerOrderThunk";

import ShipmentItemSelector from "./ShipmentItemSelector";
import ShipmentSubProducts from "./ShipmentSubProducts";
import ShipmentQuantityInfo from "./ShipmentQuantityInfo";
import ShipmentBasicFields from "./ShipmentBasicFields";
import ShipmentAddressField from "./ShipmentAddressField";
import ShipmentFileUpload from "./ShipmentFileUpload";

import styles from "../../styles/Seller/SellerShipmentForm.module.css";

const SellerShipmentForm = ({ selectedOrder }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const {
    shipmentLoading,
    shipmentError,
    shipmentSuccess,
  } = useSelector((state) => state.sellerOrders);

  const [formData, setFormData] = useState({
    selectedItem: "",
    shippedQuantity: "",
    vehicleNumber: "",
    driverName: "",
    driverMobile: "",
    shipmentFrom: "",
    shipmentFromType: "",
    shipmentFile: null,
    selectedSubProducts: [],
  });

  const selectedOrderItem = selectedOrder.orderItems?.find(
    (item) => item.productName === formData.selectedItem
  );

  const alreadyShippedQuantity = selectedOrder.shipments
    ?.filter(
      (shipment) => shipment.selectedItem === formData.selectedItem
    )
    .reduce(
      (total, shipment) =>
        total + Number(shipment.shippedQuantity || 0),
      0
    );

  const remainingQuantity = selectedOrderItem
    ? Number(selectedOrderItem.requiredQuantity) -
      alreadyShippedQuantity
    : 0;

  const shipmentFromOptions = [
    selectedOrderItem?.loadingLocation,
    selectedOrderItem?.product?.loadingLocation,
    selectedOrder?.seller?.businessProfile?.billingAddress,
    selectedOrder?.seller?.businessProfile?.shippingAddress,
  ]
    .filter(
      (address) =>
        address &&
        typeof address === "string" &&
        address.trim() !== ""
    )
    .map((address) => address.trim())
    .filter(
      (address, index, self) =>
        self.indexOf(address) === index
    );

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "shipmentFile") {
      setFormData((prev) => ({
        ...prev,
        shipmentFile: files[0],
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectItem = (e) => {
    const selectedValue = e.target.value;

    const selectedProduct = selectedOrder.orderItems?.find(
      (item) => item.productName === selectedValue
    );

    const defaultShipmentFrom =
      selectedProduct?.loadingLocation ||
      selectedProduct?.product?.loadingLocation ||
      selectedOrder?.seller?.businessProfile?.shippingAddress ||
      selectedOrder?.seller?.businessProfile?.billingAddress ||
      "";

    setFormData((prev) => ({
      ...prev,
      selectedItem: selectedValue,
      shipmentFrom: defaultShipmentFrom,
      shipmentFromType: defaultShipmentFrom ? "dropdown" : "",
      selectedSubProducts: [],
      shippedQuantity: "",
    }));
  };

  const handleShipmentFromChange = (e) => {
    const value = e.target.value;

    if (value === "custom") {
      setFormData((prev) => ({
        ...prev,
        shipmentFrom: "",
        shipmentFromType: "custom",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        shipmentFrom: value,
        shipmentFromType: "dropdown",
      }));
    }
  };

  const handleSubmit = () => {
    if (!formData.selectedItem) {
      return alert("Please select item");
    }

    if (!formData.shippedQuantity) {
      return alert("Please enter shipped quantity");
    }

    if (!formData.vehicleNumber) {
      return alert("Please enter vehicle number");
    }

    if (!formData.driverName) {
      return alert("Please enter driver name");
    }

    if (!formData.driverMobile) {
      return alert("Please enter driver contact");
    }

    if (!formData.shipmentFrom) {
      return alert("Please select or enter shipment from address");
    }

    if (
      selectedOrderItem &&
      Number(formData.shippedQuantity) > remainingQuantity
    ) {
      return alert(
        `Remaining quantity for ${formData.selectedItem} is ${remainingQuantity}`
      );
    }

    const shipmentData = new FormData();

    shipmentData.append("selectedItem", formData.selectedItem);
    shipmentData.append("shippedQuantity", formData.shippedQuantity);
    shipmentData.append("vehicleNumber", formData.vehicleNumber);
    shipmentData.append("driverName", formData.driverName);
    shipmentData.append("driverMobile", formData.driverMobile);
    shipmentData.append("shipmentFrom", formData.shipmentFrom);

    shipmentData.append(
      "shipmentTo",
      selectedOrder.shippingAddress?.fullAddress || ""
    );

    shipmentData.append(
      "selectedSubProducts",
      JSON.stringify(formData.selectedSubProducts)
    );

    if (formData.shipmentFile) {
      shipmentData.append("shipmentFile", formData.shipmentFile);
    }

    dispatch(
      addShipmentToOrderThunk({
        orderId: selectedOrder._id,
        shipmentData,
      })
    ).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        setFormData({
          selectedItem: "",
          shippedQuantity: "",
          vehicleNumber: "",
          driverName: "",
          driverMobile: "",
          shipmentFrom: "",
          shipmentFromType: "",
          shipmentFile: null,
          selectedSubProducts: [],
        });

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    });
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.heading}>Raise Weight Ticket</h2>

      {shipmentSuccess && (
        <div className={styles.success}>{shipmentSuccess}</div>
      )}

      {shipmentError && (
        <div className={styles.error}>{shipmentError}</div>
      )}

      <div className={styles.formGrid}>
        <ShipmentItemSelector
          selectedOrder={selectedOrder}
          selectedItem={formData.selectedItem}
          onSelectItem={handleSelectItem}
        />

        <ShipmentSubProducts
          selectedOrderItem={selectedOrderItem}
          selectedSubProducts={formData.selectedSubProducts}
          setFormData={setFormData}
        />

        <ShipmentQuantityInfo
          shippedQuantity={formData.shippedQuantity}
          onChange={handleChange}
          selectedOrderItem={selectedOrderItem}
          alreadyShippedQuantity={alreadyShippedQuantity}
          remainingQuantity={remainingQuantity}
        />

        <ShipmentBasicFields
          formData={formData}
          handleChange={handleChange}
        />

        <ShipmentAddressField
          formData={formData}
          handleChange={handleChange}
          handleShipmentFromChange={handleShipmentFromChange}
          shipmentFromOptions={shipmentFromOptions}
          shipmentTo={
            selectedOrder.shippingAddress?.fullAddress || ""
          }
          setFormData={setFormData}
        />

        <ShipmentFileUpload
          fileInputRef={fileInputRef}
          handleChange={handleChange}
        />
      </div>

      <button
        className={styles.submitButton}
        onClick={handleSubmit}
        disabled={
          shipmentLoading ||
          (selectedOrderItem && remainingQuantity <= 0)
        }
      >
        {shipmentLoading
          ? "Submitting..."
          : selectedOrderItem && remainingQuantity <= 0
          ? "Fully Shipped"
          : "Submit Shipment Details"}
      </button>
    </div>
  );
};

export default SellerShipmentForm;