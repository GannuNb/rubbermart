import React from "react";
import { FaBoxOpen, FaTruck } from "react-icons/fa";

import styles from "../../../styles/Buyer/BuyerSingleShippingInvoice.module.css";

const ShipmentItemsSection = ({ shipment, order }) => {
  const matchedItem = order?.orderItems?.find(
    (item) => item.productName === shipment?.selectedItem,
  );

  /* =========================
     IMAGE
  ========================= */

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
          "",
        ),
      );
    }

    return `data:${
      matchedItem.productImage.contentType || "image/jpeg"
    };base64,${base64}`;
  };

  /* =========================
     PRODUCT VALUES
  ========================= */

  const shippedQty = Number(shipment?.shippedQuantity || 0);

  const pricePerMT = Number(matchedItem?.pricePerMT || 0);

  const productTaxable = shippedQty * pricePerMT;

  const productGSTType = order?.gstType;

  let productIGST = 0;

  let productCGST = 0;

  let productSGST = 0;

  if (productGSTType === "igst") {
    productIGST = productTaxable * 0.18;
  }

  if (productGSTType === "cgst_sgst") {
    productCGST = productTaxable * 0.09;

    productSGST = productTaxable * 0.09;
  }

  const productTotal = productTaxable + productIGST + productCGST + productSGST;

  /* =========================
     TRANSPORT VALUES
  ========================= */

  const transportPrice = Number(shipment?.transportPrice || 0);

  const transportGSTAmount = Number(shipment?.transportGSTAmount || 0);

  const transportGSTType = shipment?.transportGSTType;

  let transportIGST = 0;

  let transportCGST = 0;

  let transportSGST = 0;

  if (transportGSTType === "igst") {
    transportIGST = transportGSTAmount;
  }

  if (transportGSTType === "cgst_sgst") {
    transportCGST = transportGSTAmount / 2;

    transportSGST = transportGSTAmount / 2;
  }

  const transportTotal = transportPrice + transportGSTAmount;

  /* =========================
     GRAND TOTAL
  ========================= */

  const grandTotal = productTotal + transportTotal;

  return (
    <div className={styles.itemsWrapper}>
      {/* =========================
          PRODUCT TABLE
      ========================= */}
      <div className={styles.itemsCard}>
        <div className={styles.itemsHeader}>
          <FaBoxOpen className={styles.itemsIcon} />

          <h3 className={styles.sectionTitle}>Product Invoice</h3>
        </div>

        <div className={styles.tableWrapper}>
          {/* =========================
        TABLE HEADER
    ========================= */}

          <div className={styles.tableHeader}>
            <div>Product</div>

            <div>Ordered Qty</div>

            <div>Shipped Qty</div>

            <div>Price / MT</div>

            <div>Taxable Amount</div>

            <div>{productGSTType === "igst" ? "IGST 18%" : "CGST 9%"}</div>

            <div>{productGSTType === "igst" ? "-" : "SGST 9%"}</div>

            <div>Total Amount</div>
          </div>

          {/* =========================
        TABLE ROW
    ========================= */}

          <div className={styles.tableRow}>
            {/* PRODUCT */}

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

            {/* ORDERED QTY */}

            <div className={styles.centerCell}>
              {matchedItem?.requiredQuantity || 0} MT
            </div>

            {/* SHIPPED QTY */}

            <div className={styles.centerCell}>{shippedQty} MT</div>

            {/* PRICE / MT */}

            <div className={styles.centerCell}>
              ₹ {pricePerMT.toLocaleString("en-IN")}
            </div>

            {/* TAXABLE */}

            <div className={styles.centerCell}>
              ₹{" "}
              {productTaxable.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}
            </div>

            {/* GST */}

            {productGSTType === "igst" ? (
              <>
                <div className={styles.centerCell}>
                  ₹{" "}
                  {productIGST.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </div>

                <div className={styles.centerCell}>-</div>
              </>
            ) : (
              <>
                <div className={styles.centerCell}>
                  ₹{" "}
                  {productCGST.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </div>

                <div className={styles.centerCell}>
                  ₹{" "}
                  {productSGST.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </div>
              </>
            )}

            {/* TOTAL */}

            <div className={styles.totalAmountCell}>
              ₹{" "}
              {productTotal.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          TRANSPORT TABLE
      ========================= */}

      <div className={styles.itemsCard}>
        <div className={styles.itemsHeader}>
          <FaTruck className={styles.itemsIcon} />

          <h3 className={styles.sectionTitle}>Transport Invoice</h3>
        </div>

        <div className={styles.tableWrapper}>
          <div className={styles.tableHeader}>
            <div>Description</div>

            <div>HSN</div>

            <div>GST Type</div>

            <div>Taxable</div>

            {transportGSTType === "igst" ? (
              <div>IGST 5%</div>
            ) : (
              <>
                <div>CGST 2.5%</div>

                <div>SGST 2.5%</div>
              </>
            )}

            <div>Total</div>
          </div>

          <div className={styles.tableRow}>
            <div className={styles.transportDetails}>
              <h4>Transportation Charges</h4>

              <p>
                {shipment?.shipmentFrom} → {shipment?.shipmentTo}
              </p>
            </div>

            <div className={styles.centerCell}>
              {shipment?.transportHSNCode}
            </div>

            <div className={styles.centerCell}>
              {transportGSTType === "igst" ? "IGST" : "CGST + SGST"}
            </div>

            <div className={styles.centerCell}>
              ₹ {transportPrice.toLocaleString("en-IN")}
            </div>

            {transportGSTType === "igst" ? (
              <div className={styles.centerCell}>
                ₹ {transportIGST.toLocaleString("en-IN")}
              </div>
            ) : (
              <>
                <div className={styles.centerCell}>
                  ₹ {transportCGST.toLocaleString("en-IN")}
                </div>

                <div className={styles.centerCell}>
                  ₹ {transportSGST.toLocaleString("en-IN")}
                </div>
              </>
            )}

            <div className={styles.totalAmountCell}>
              ₹ {transportTotal.toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          FINAL SUMMARY
      ========================= */}

      <div className={styles.invoiceSummaryCard}>
        <h3>Invoice Summary</h3>

        <div className={styles.summaryRow}>
          <span>Product Total</span>

          <span>₹ {productTotal.toLocaleString("en-IN")}</span>
        </div>

        <div className={styles.summaryRow}>
          <span>Transport Total</span>

          <span>₹ {transportTotal.toLocaleString("en-IN")}</span>
        </div>

        <div className={styles.finalTotalRow}>
          <span>Grand Total</span>

          <span>₹ {grandTotal.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>
  );
};

export default ShipmentItemsSection;
