import React, { useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { addShipmentToOrderThunk } from "../../redux/slices/sellerOrderThunk";

import ShipmentItemSelector from "./ShipmentItemSelector";
import ShipmentSubProducts from "./ShipmentSubProducts";
import ShipmentQuantityInfo from "./ShipmentQuantityInfo";
// import ShipmentBasicFields from "./ShipmentBasicFields";
import ShipmentAddressField from "./ShipmentAddressField";
import ShipmentFileUpload from "./ShipmentFileUpload";

import styles from "../../styles/Seller/SellerShipmentForm.module.css";

const SellerShipmentForm = ({ selectedOrder }) => {
  const dispatch = useDispatch();

  const packedItemPhotoRef = useRef(null);

  const weightTicketRef = useRef(null);

  const { shipmentLoading, shipmentError, shipmentSuccess } = useSelector(
    (state) => state.sellerOrders,
  );

  const [formData, setFormData] = useState({
    selectedItem: "",

    shippedQuantity: "",

    shipmentFrom: "",

    shipmentFromType: "",

    packedItemPhoto: null,

    weightTicket: null,

    selectedSubProducts: [],
  });

  const selectedOrderItem = selectedOrder.orderItems?.find(
    (item) => item.productName === formData.selectedItem,
  );

  const alreadyShippedQuantity = selectedOrder.shipments
    ?.filter((shipment) => shipment.selectedItem === formData.selectedItem)
    .reduce(
      (total, shipment) => total + Number(shipment.shippedQuantity || 0),
      0,
    );

  const remainingQuantity = selectedOrderItem
    ? Number(selectedOrderItem.requiredQuantity) - alreadyShippedQuantity
    : 0;

  const shipmentFromOptions = [
    selectedOrderItem?.loadingLocation,

    selectedOrderItem?.product?.loadingLocation,

    selectedOrder?.seller?.businessProfile?.billingAddress,

    selectedOrder?.seller?.businessProfile?.shippingAddress,
  ]
    .filter(
      (address) =>
        address && typeof address === "string" && address.trim() !== "",
    )
    .map((address) => address.trim())
    .filter((address, index, self) => self.indexOf(address) === index);

  /* =========================
     HANDLE CHANGE
  ========================= */

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    /* FILES */

    if (name === "packedItemPhoto" || name === "weightTicket") {
      setFormData((prev) => ({
        ...prev,

        [name]: files[0],
      }));

      return;
    }

    /* TEXT */

    setFormData((prev) => ({
      ...prev,

      [name]: value,
    }));
  };

  /* =========================
     SELECT ITEM
  ========================= */

  const handleSelectItem = (e) => {
    const selectedValue = e.target.value;

    const selectedProduct = selectedOrder.orderItems?.find(
      (item) => item.productName === selectedValue,
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

  /* =========================
     SHIPMENT FROM
  ========================= */

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

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = () => {
    if (!formData.selectedItem) {
      return alert("Please select item");
    }

    if (!formData.shippedQuantity) {
      return alert("Please enter shipped quantity");
    }

    if (!formData.weightTicket) {
      return alert("Please upload weight ticket");
    }

    if (!formData.packedItemPhoto) {
      return alert("Please upload packed item photo");
    }

    if (!formData.shipmentFrom) {
      return alert("Please select shipment from address");
    }

    if (
      selectedOrderItem &&
      Number(formData.shippedQuantity) > remainingQuantity
    ) {
      return alert(
        `Remaining quantity for ${formData.selectedItem} is ${remainingQuantity}`,
      );
    }

    const shipmentData = new FormData();

    shipmentData.append("selectedItem", formData.selectedItem);

    shipmentData.append("shippedQuantity", formData.shippedQuantity);

    shipmentData.append("shipmentFrom", formData.shipmentFrom);

    shipmentData.append(
      "shipmentTo",
      selectedOrder.shippingAddress?.fullAddress || "",
    );

    shipmentData.append(
      "selectedSubProducts",
      JSON.stringify(formData.selectedSubProducts),
    );

    shipmentData.append("packedItemPhoto", formData.packedItemPhoto);

    shipmentData.append("weightTicket", formData.weightTicket);

    dispatch(
      addShipmentToOrderThunk({
        orderId: selectedOrder._id,

        shipmentData,
      }),
    ).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        setFormData({
          selectedItem: "",

          shippedQuantity: "",

          shipmentFrom: "",

          shipmentFromType: "",

          packedItemPhoto: null,

          weightTicket: null,

          selectedSubProducts: [],
        });

        if (packedItemPhotoRef.current) {
          packedItemPhotoRef.current.value = "";
        }

        if (weightTicketRef.current) {
          weightTicketRef.current.value = "";
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

      {shipmentError && <div className={styles.error}>{shipmentError}</div>}

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

        <ShipmentAddressField
          formData={formData}
          handleChange={handleChange}
          handleShipmentFromChange={handleShipmentFromChange}
          shipmentFromOptions={shipmentFromOptions}
          shipmentTo={selectedOrder.shippingAddress?.fullAddress || ""}
          setFormData={setFormData}
        />

        <ShipmentFileUpload
          packedItemPhotoRef={packedItemPhotoRef}
          weightTicketRef={weightTicketRef}
          handleChange={handleChange}
        />
      </div>

      <button
        className={styles.submitButton}
        onClick={handleSubmit}
        disabled={
          shipmentLoading ||
          (selectedOrderItem && remainingQuantity <= 0) ||
          selectedOrder.orderStatus === "pending"
        }
      >
        {shipmentLoading
          ? "Submitting..."
          : selectedOrder.orderStatus === "pending"
            ? "Please Accept Order Before Shipment"
            : selectedOrderItem && remainingQuantity <= 0
              ? "Fully Shipped"
              : "Submit Shipment Details"}
      </button>
    </div>
  );
};

export default SellerShipmentForm;
