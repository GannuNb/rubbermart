// src/components/admin/AdminSingleShipping/AdminShipmentProductCard.js

import React from "react";
import styles from "../../../styles/Admin/AdminSingleShippingInvoice.module.css";

const AdminShipmentProductCard = ({
  shipment,
  order,
}) => {
  const matchedItem =
    order?.orderItems?.find(
      (item) =>
        item?.productName ===
        shipment?.selectedItem
    );

  const getImage = () => {
    if (
      matchedItem?.productImage?.data
    ) {
      let base64 = "";

      if (
        typeof matchedItem.productImage.data ===
        "string"
      ) {
        base64 =
          matchedItem.productImage.data;
      } else if (
        matchedItem.productImage.data?.data
      ) {
        base64 = btoa(
          new Uint8Array(
            matchedItem.productImage.data.data
          ).reduce(
            (data, byte) =>
              data +
              String.fromCharCode(byte),
            ""
          )
        );
      }

      return `data:${
        matchedItem.productImage.contentType ||
        "image/jpeg"
      };base64,${base64}`;
    }

    return "/logo192.png";
  };

  const shippedQty = Number(
    shipment?.shippedQuantity || 0
  );

  const pricePerMT = Number(
    matchedItem?.pricePerMT || 0
  );

  const subtotal =
    shippedQty * pricePerMT;

  const isIGST =
    order?.gstType === "igst";

  const igst = isIGST
    ? (subtotal * 18) / 100
    : 0;

  const cgst = !isIGST
    ? (subtotal * 9) / 100
    : 0;

  const sgst = !isIGST
    ? (subtotal * 9) / 100
    : 0;

  const grandTotal =
    subtotal + igst + cgst + sgst;

  return (
    <div className={styles.productCard}>
      {/* Title */}
      <div className={styles.productLeft}>
        <h3 className={styles.cardTitle}>
          Product in this Shipment
        </h3>
      </div>

      {/* Header Row */}
      <div className={styles.productTableHeader}>
        <div>Product</div>
        <div>Loading Location</div>
        <div>Ordered Quantity</div>
        <div>Shipped Quantity/MT</div>
        <div>Price / MT</div>
        <div>Total Amount</div>
      </div>

      {/* Value Row */}
      <div className={styles.tableRow}>
        <div className={styles.productCell}>
          <img
            src={getImage()}
            alt="product"
            className={styles.productImage}
          />

          <span className={styles.productName}>
            {shipment?.selectedItem || "-"}
          </span>
        </div>

        <div>
          {matchedItem?.loadingLocation || "-"}
        </div>

        <div>
          {matchedItem?.requiredQuantity || 0}
        </div>

        <div>
          {shipment?.shippedQuantity || 0}
        </div>

        <div>
          ₹ {pricePerMT.toLocaleString()}
        </div>

        <div>
          ₹ {subtotal.toLocaleString()}
        </div>
      </div>

      {/* Summary */}
      <div className={styles.summaryBox}>
        <div className={styles.summaryRow}>
          <span>Subtotal</span>
          <span>
            ₹ {subtotal.toLocaleString()}
          </span>
        </div>

        {isIGST ? (
          <div className={styles.summaryRow}>
            <span>IGST (18%)</span>
            <span>
              ₹ {igst.toFixed(0)}
            </span>
          </div>
        ) : (
          <>
            <div className={styles.summaryRow}>
              <span>CGST (9%)</span>
              <span>
                ₹ {cgst.toFixed(0)}
              </span>
            </div>

            <div className={styles.summaryRow}>
              <span>SGST (9%)</span>
              <span>
                ₹ {sgst.toFixed(0)}
              </span>
            </div>
          </>
        )}

        <div className={styles.totalBox}>
          <span>Total Amount</span>
          <span>
            ₹ {grandTotal.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminShipmentProductCard;