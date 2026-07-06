import React, { useState } from "react";
import styles from "../../../styles/Admin/AdminSingleShippingInvoice.module.css";

const AdminShipmentProductCard = ({ shipment, order }) => {
  // Added the missing state to control the dropdown accordion
  const [isOpen, setIsOpen] = useState(false);

  const matchedItem = order?.orderItems?.find(
    (item) => item?.productName === shipment?.selectedItem,
  );

  const getImage = () => {
    if (matchedItem?.productImage?.data) {
      let base64 = "";

      if (typeof matchedItem.productImage.data === "string") {
        base64 = matchedItem.productImage.data;
      } else if (matchedItem.productImage.data?.data) {
        base64 = btoa(
          new Uint8Array(matchedItem.productImage.data.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            "",
          ),
        );
      }

      return `data:${
        matchedItem.productImage.contentType || "image/jpeg"
      };base64,${base64}`;
    }

    return "/logo192.png";
  };

  const shippedQty = Number(shipment?.shippedQuantity || 0);
  const pricePerMT = Number(matchedItem?.pricePerMT || 0);
  const subtotal = shippedQty * pricePerMT;
  const isIGST = order?.gstType === "igst";
  const igst = isIGST ? (subtotal * 18) / 100 : 0;
  const cgst = !isIGST ? (subtotal * 9) / 100 : 0;
  const sgst = !isIGST ? (subtotal * 9) / 100 : 0;
  const grandTotal = subtotal + igst + cgst + sgst;

  return (
    <div className={styles.productCard}>
      {/* Clickable Header Area */}
      <div 
        className={styles.productLeft} 
        onClick={() => setIsOpen(!isOpen)}
        style={{ display: "flex", alignItems: "center", cursor: "pointer", userSelect: "none" }}
      >
        <h3 className={styles.cardTitle} style={{ margin: 0 }}>
          Product in this Shipment
        </h3>
        
        {/* Dynamic Plus/Minus Icon Indicator */}
        <span className={`${styles.toggleIcon} ${isOpen ? styles.iconActive : ""}`}>
          {isOpen ? "−" : "+"}
        </span>
      </div>

      {/* Accordion Content Block */}
      {isOpen && (
        <div style={{ marginTop: "20px" }}>
          {/* Main Container Wrapper to manage desktop table view vs mobile grid stack */}
          <div className={styles.tableWrapper}>
            {/* Header Row */}
            <div className={styles.productTableHeader}>
              <div>Product</div>
              <div>Loading Location</div>
              <div>Shipment From</div>
              <div>Shipment To</div>
              <div>Ordered Quantity</div>
              <div>Shipped Quantity/MT</div>
              <div>Price / MT</div>
              <div>Total Amount</div>
            </div>

            {/* Value Row */}
            <div className={styles.tableRow}>
              <div className={styles.productCell}>
                <span className={styles.mobileLabel}>Product</span>
                <div className={styles.productContent}>
                  <img src={getImage()} alt="product" className={styles.productImage} />
                  <span className={styles.productName}>
                    {shipment?.selectedItem || "-"}
                  </span>
                </div>
              </div>

              <div>
                <span className={styles.mobileLabel}>Loading Location</span>
                <span className={styles.cellValue}>{matchedItem?.loadingLocation || "-"}</span>
              </div>

              <div>
                <span className={styles.mobileLabel}>Shipment From</span>
                <span className={styles.cellValue}>{shipment?.shipmentFrom || "-"}</span>
              </div>

              <div>
                <span className={styles.mobileLabel}>Shipment To</span>
                <span className={styles.cellValue}>{shipment?.shipmentTo || "-"}</span>
              </div>
              
              <div>
                <span className={styles.mobileLabel}>Ordered Quantity</span>
                <span className={styles.cellValue}>{matchedItem?.requiredQuantity || 0}</span>
              </div>

              <div>
                <span className={styles.mobileLabel}>Shipped Quantity/MT</span>
                <span className={styles.cellValue}>{shipment?.shippedQuantity || 0}</span>
              </div>

              <div>
                <span className={styles.mobileLabel}>Price / MT</span>
                <span className={styles.cellValue}>₹ {pricePerMT.toLocaleString()}</span>
              </div>

              <div>
                <span className={styles.mobileLabel}>Total Amount</span>
                <span className={styles.cellValue}>₹ {subtotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className={styles.summaryBox}>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>₹ {subtotal.toLocaleString()}</span>
            </div>

            {isIGST ? (
              <div className={styles.summaryRow}>
                <span>IGST (18%)</span>
                <span>₹ {igst.toFixed(0)}</span>
              </div>
            ) : (
              <>
                <div className={styles.summaryRow}>
                  <span>CGST (9%)</span>
                  <span>₹ {cgst.toFixed(0)}</span>
                </div>

                <div className={styles.summaryRow}>
                  <span>SGST (9%)</span>
                  <span>₹ {sgst.toFixed(0)}</span>
                </div>
              </>
            )}

            <div className={styles.totalBox}>
              <span>Total Amount</span>
              <span>₹ {grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShipmentProductCard;