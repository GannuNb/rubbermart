import React from "react";
import styles from "../../../styles/Admin/AdminOrderItemsCard.module.css";

const AdminOrderItemsCard = ({ order }) => {
  const items = order?.orderItems || [];

  const getImageSrc = (image) => {
    if (!image || !image.data) return null;

    try {
      const byteArray = image.data.data;

      if (!byteArray || !Array.isArray(byteArray)) {
        return null;
      }

      const base64String = btoa(
        new Uint8Array(byteArray).reduce(
          (data, byte) =>
            data + String.fromCharCode(byte),
          ""
        )
      );

      return `data:${image.contentType};base64,${base64String}`;
    } catch {
      return null;
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <h3>
          Products / Items Details (
          {items.length})
        </h3>
      </div>

      {/* Table Header */}
      <div className={styles.tableHeader}>
        <div>Products</div>
        <div>Quantity / MT</div>
        <div>Loading Location</div>
        <div>Price / MT</div>
        <div>Total Price</div>
        <div></div>
      </div>

      {/* Items */}
      {items.map((item, index) => {
        const imageSrc = getImageSrc(
          item?.productImage
        );

        return (
          <div
            key={index}
            className={styles.itemRow}
          >
            {/* Product */}
            <div className={styles.productBox}>
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt="product"
                  className={styles.productImage}
                />
              ) : (
                <div
                  className={
                    styles.placeholderImage
                  }
                />
              )}

              <span>
                {item?.productName || "-"}
              </span>
            </div>

            {/* Quantity */}
            <div>
              {item?.requiredQuantity || 0}
            </div>

            {/* Loading */}
            <div>
              {item?.loadingLocation || "-"}
            </div>

            {/* Price */}
            <div>
              ₹ {item?.pricePerMT || 0} / MT
            </div>

            {/* Total */}
            <div>
              ₹ {item?.subtotal || 0}
            </div>

            {/* Invoice */}
            <div>
              <button
                className={styles.invoiceBtn}
              >
                View Invoice
              </button>
            </div>
          </div>
        );
      })}

      {/* Bottom Summary */}
      <div className={styles.summarySection}>
        <div className={styles.summaryRow}>
          <span>Subtotal</span>
          <span>
            ₹ {order?.taxableAmount || 0}
          </span>
        </div>

        {order?.gstType === "igst" ? (
          <div className={styles.summaryRow}>
            <span>IGST</span>
            <span>
              ₹ {order?.igstAmount || 0}
            </span>
          </div>
        ) : (
          <>
            <div className={styles.summaryRow}>
              <span>CGST</span>
              <span>
                ₹ {order?.cgstAmount || 0}
              </span>
            </div>

            <div className={styles.summaryRow}>
              <span>SGST</span>
              <span>
                ₹ {order?.sgstAmount || 0}
              </span>
            </div>
          </>
        )}

        <div className={styles.totalBox}>
          <span>Total Amount</span>
          <span>
            ₹ {order?.totalAmount || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderItemsCard;