import React from "react";
import styles from "../../styles/Seller/SellerShipmentForm.module.css";

const ShipmentSubProducts = ({
  selectedOrderItem,
  selectedSubProducts,
  setFormData,
}) => {
  if (!selectedOrderItem?.subProducts?.length) {
    return null;
  }

  return (
    <div className={styles.field}>
      <label>Select Sub Products</label>

      <select
        multiple
        value={selectedSubProducts}
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
  );
};

export default ShipmentSubProducts;