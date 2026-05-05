import React from "react";
import { FaBoxOpen } from "react-icons/fa";
import styles from "../../../styles/Buyer/BuyerSingleShippingInvoice.module.css";

const ShipmentItemsSection = ({ shipment, order }) => {

  const matchedItem = order?.orderItems?.find(
    (item) => item.productName === shipment?.selectedItem
  );

  const getImage = () => {
    if (!matchedItem?.productImage?.data) {
      return "/logo192.png";
    }

    let base64 = "";

    if (typeof matchedItem.productImage.data === "string") {
      base64 = matchedItem.productImage.data;
    } else if (matchedItem.productImage.data?.data) {
      base64 = btoa(
        new Uint8Array(matchedItem.productImage.data.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
    }

    return `data:${
      matchedItem.productImage.contentType || "image/jpeg"
    };base64,${base64}`;
  };

  const orderedQty = Number(matchedItem?.requiredQuantity || 0);
  const shippedQty = Number(shipment?.shippedQuantity || 0);
  const pricePerMT = Number(matchedItem?.pricePerMT || 0);

  const totalItemAmount = orderedQty * pricePerMT;

  return (
    <div className={styles.itemsCard}>
      
      {/* HEADER */}
      <div className={styles.itemsHeader}>
        <FaBoxOpen className={styles.itemsIcon} />
        <h3 className={styles.sectionTitle}>
          Items in the Shipment
        </h3>
      </div>

      {/* ⭐ SCROLL WRAPPER */}
      <div className={styles.tableWrapper}>

        {/* TABLE HEADER */}
        <div className={styles.tableHeader}>
          <div>Item Details</div>
          <div>Ordered Qty</div>
          <div>Shipped Qty</div>
          <div>Price / MT</div>
          <div>Total Item Amount</div>
        </div>

        {/* TABLE BODY */}
        <div className={styles.tableRow}>
          
          <div className={styles.itemDetails}>
            <img
              src={getImage()}
              alt="product"
              className={styles.itemImage}
            />

            <div>
              <h4>{shipment?.selectedItem || "-"}</h4>
              <p>{matchedItem?.loadingLocation || "-"}</p>
            </div>
          </div>

          <div className={styles.centerCell}>{orderedQty}</div>
          <div className={styles.centerCell}>{shippedQty}</div>
          <div className={styles.centerCell}>
            ₹ {pricePerMT.toLocaleString()}
          </div>
          <div className={styles.centerCell}>
            ₹ {totalItemAmount.toLocaleString()}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ShipmentItemsSection;