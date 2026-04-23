import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addShipmentToOrderThunk } from "../../redux/slices/sellerOrderThunk";
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
        <div className={styles.field}>
          <label>Select Item</label>

          <select
            name="selectedItem"
            value={formData.selectedItem}
            onChange={handleSelectItem}
          >
            <option value="">Select Product</option>

            {selectedOrder.orderItems?.map((item) => {
              const shippedQty = selectedOrder.shipments
                ?.filter(
                  (shipment) =>
                    shipment.selectedItem === item.productName
                )
                .reduce(
                  (total, shipment) =>
                    total + Number(shipment.shippedQuantity || 0),
                  0
                );

              const remainingQty =
                Number(item.requiredQuantity) - shippedQty;

              return (
                <option
                  key={item.product?._id || item.productName}
                  value={item.productName}
                  disabled={remainingQty <= 0}
                >
                  {item.productName}
                  {remainingQty <= 0
                    ? " (Fully Shipped)"
                    : ` (Remaining: ${remainingQty})`}
                </option>
              );
            })}
          </select>
        </div>

        {selectedOrderItem?.subProducts?.length > 0 && (
          <div className={styles.field}>
            <label>Select Sub Products</label>

            <select
              multiple
              value={formData.selectedSubProducts}
              onChange={(e) => {
                const values = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                );

                setFormData((prev) => ({
                  ...prev,
                  selectedSubProducts: values,
                }));
              }}
            >
              {selectedOrderItem.subProducts.map((subProduct, index) => (
                <option key={index} value={subProduct}>
                  {subProduct}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className={styles.field}>
          <label>Shipped Quantity</label>

          <input
            type="number"
            name="shippedQuantity"
            value={formData.shippedQuantity}
            onChange={handleChange}
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
            <>
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
            </>
          )}
        </div>

        <div className={styles.field}>
          <label>Shipment To</label>

          <input
            type="text"
            value={selectedOrder.shippingAddress?.fullAddress || ""}
            readOnly
          />
        </div>

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