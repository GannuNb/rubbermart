import React from "react";
import styles from "../../styles/Seller/SellerShipmentForm.module.css";

const ShipmentItemSelector = ({
  selectedOrder,
  selectedItem,
  onSelectItem,
}) => {
  return (
    <div className={styles.field}>
      <label>Select Item</label>

      <select
        name="selectedItem"
        value={selectedItem}
        onChange={onSelectItem}
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
  );
};

export default ShipmentItemSelector;