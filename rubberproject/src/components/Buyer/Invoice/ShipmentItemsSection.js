import React, { useState } from "react";
import { FaBoxOpen, FaTruck, FaFileInvoiceDollar } from "react-icons/fa";

import styles from "../../../styles/Buyer/BuyerSingleShippingInvoice.module.css";

const ShipmentItemsSection = ({ shipment, order }) => {
  const matchedItem = order?.orderItems?.find(
    (item) => item.productName === shipment?.selectedItem,
  );

  /* =========================
      ACCORDION STATES
  ========================= */
  const [isTransportOpen, setIsTransportOpen] = useState(false);

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
    productIGST = Number((productTaxable * 0.18).toFixed(2));
  }

  if (productGSTType === "cgst_sgst") {
    productCGST = Number((productTaxable * 0.09).toFixed(2));
    productSGST = Number((productTaxable * 0.09).toFixed(2));
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
    transportCGST = Number((transportGSTAmount / 2).toFixed(2));
    transportSGST = Number((transportGSTAmount / 2).toFixed(2));
  }

  const transportTotal = Number(
    shipment?.transportFinalAmount || transportPrice + transportGSTAmount || 0,
  );

  /* =========================
      GRAND TOTAL
  ========================= */
  const grandTotal = Number((productTotal + transportTotal).toFixed(2));

  return (
    <div className={styles.itemsWrapper}>
      {/* =========================
           PRODUCT TABLE CARD
      ========================= */}
      <div
        className={styles.itemsCard}
        style={{ padding: "0", overflow: "hidden" }}
      >
        {/* HEADER ARRANGE */}
        <div
          className={styles.cardAccordionHeader}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "22px",
          }}
        >
          <div className={styles.itemsHeader} style={{ margin: "0" }}>
            <FaBoxOpen className={styles.itemsIcon} />
            <h3 className={styles.sectionTitle}>Product Invoice</h3>
          </div>
        </div>

        {/* CONTAINER WORK */}
        <div style={{ padding: "0 22px 22px 22px" }}>
          <div className={styles.tableWrapper}>
            <div className={styles.tableHeader}>
              <div>Product</div>
              <div>Ordered Qty</div>
              <div>Shipped Qty</div>
              <div>Price / MT</div>
              <div>Taxable Amount</div>
              {productGSTType === "igst" ? (
                <div>IGST 18%</div>
              ) : (
                <>
                  <div>CGST 9%</div>
                  <div>SGST 9%</div>
                </>
              )}
              <div>Total Amount</div>
              <div>Payment Status</div>
            </div>

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

              <div className={styles.centerCell}>
                {matchedItem?.requiredQuantity || 0} MT
              </div>
              <div className={styles.centerCell}>{shippedQty} MT</div>
              <div className={styles.centerCell}>
                ₹ {pricePerMT.toLocaleString("en-IN")}
              </div>
              <div className={styles.centerCell}>
                ₹{" "}
                {productTaxable.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </div>

              {productGSTType === "igst" ? (
                <div className={styles.centerCell}>
                  ₹{" "}
                  {productIGST.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </div>
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

              <div className={styles.totalAmountCell}>
                ₹{" "}
                {productTotal.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </div>
              <div className={styles.paymentStatusCell}>
                <span className={styles.paidBadge}>✅ Paid</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
           TRANSPORT TABLE CARD
      ========================= */}
      <div
        className={styles.itemsCard}
        style={{ padding: "0", overflow: "hidden" }}
      >
        {/* HEADER ARRANGE */}
        <div
          className={styles.cardAccordionHeader}
          onClick={() => setIsTransportOpen(!isTransportOpen)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "22px",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <div className={styles.itemsHeader} style={{ margin: "0" }}>
            <FaTruck className={styles.itemsIcon} />
            <h3 className={styles.sectionTitle}>Transport Invoice</h3>
          </div>

          <div
            className={`${styles.toggleIconBtn} ${isTransportOpen ? styles.activeToggle : ""}`}
          >
            {isTransportOpen ? "−" : "+"}
          </div>
        </div>

        {/* CONTAINER WORK */}
        {isTransportOpen && (
          <div style={{ padding: "0 22px 22px 22px" }}>
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
                  {shipment?.transportHSNCode || "9965"}
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
        )}
      </div>

      {/* =========================
           FINAL SUMMARY CARD
      ========================= */}
      <div
        className={styles.invoiceSummaryCard}
        style={{ padding: "0", overflow: "hidden" }}
      >
        {/* HEADER ARRANGE */}
        <div
          className={styles.cardAccordionHeader}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FaFileInvoiceDollar
              style={{ fontSize: "17px", color: "#6d28d9" }}
            />
            <h3
              style={{
                margin: "0",
                fontSize: "20px",
                fontWeight: "700",
                color: "#101113",
              }}
            >
              Invoice Summary
            </h3>
          </div>
        </div>

        {/* CONTAINER WORK */}
        <div style={{ padding: "0 24px 24px 24px" }}>
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
    </div>
  );
};

export default ShipmentItemsSection;
