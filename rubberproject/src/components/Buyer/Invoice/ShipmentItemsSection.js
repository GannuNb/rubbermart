import React from "react";
import { FaBoxOpen } from "react-icons/fa";
import styles from "../../../styles/Buyer/BuyerSingleShippingInvoice.module.css";

const ShipmentItemsSection = ({ shipment, order }) => {
  const matchedItem = order?.orderItems?.find(
    (item) => item.productName === shipment?.selectedItem
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
        new Uint8Array(
          matchedItem.productImage.data.data
        ).reduce(
          (data, byte) =>
            data + String.fromCharCode(byte),
          ""
        )
      );
    }

    return `data:${
      matchedItem.productImage.contentType ||
      "image/jpeg"
    };base64,${base64}`;
  };

  /* =========================
     BASIC VALUES
  ========================= */

  const orderedQty = Number(
    matchedItem?.requiredQuantity || 0
  );

  const shippedQty = Number(
    shipment?.shippedQuantity || 0
  );

  const pricePerMT = Number(
    matchedItem?.pricePerMT || 0
  );

  /* =========================
     TAXABLE AMOUNT
     (ONLY SHIPMENT QTY)
  ========================= */

  const taxableAmount =
    shippedQty * pricePerMT;

  /* =========================
     GST CALCULATION
  ========================= */

  const gstType = order?.gstType;

  let igstAmount = 0;
  let cgstAmount = 0;
  let sgstAmount = 0;

  // IGST = 18%
  if (gstType === "igst") {
    igstAmount =
      taxableAmount * 0.18;
  }

  // CGST + SGST = 9% + 9%
  if (gstType === "cgst_sgst") {
    cgstAmount =
      taxableAmount * 0.09;

    sgstAmount =
      taxableAmount * 0.09;
  }

  const totalAmount =
    taxableAmount +
    igstAmount +
    cgstAmount +
    sgstAmount;

  return (
    <div className={styles.itemsCard}>
      {/* HEADER */}

      <div className={styles.itemsHeader}>
        <FaBoxOpen
          className={styles.itemsIcon}
        />

        <h3 className={styles.sectionTitle}>
          Items in the Shipment
        </h3>
      </div>

      {/* TABLE */}

      <div className={styles.tableWrapper}>
        {/* TABLE HEADER */}

        <div className={styles.tableHeader}>
          <div>Item Details</div>
          <div>Ordered Qty</div>
          <div>Shipped Qty</div>
          <div>Price / MT</div>
          <div>Taxable Amount</div>

          {gstType === "igst" ? (
            <div>IGST (18%)</div>
          ) : (
            <>
              <div>CGST (9%)</div>
              <div>SGST (9%)</div>
            </>
          )}

          <div>Total Amount</div>
        </div>

        {/* TABLE BODY */}

        <div className={styles.tableRow}>
          {/* ITEM */}

          <div className={styles.itemDetails}>
            <img
              src={getImage()}
              alt="product"
              className={styles.itemImage}
            />

            <div>
              <h4>
                {shipment?.selectedItem ||
                  "-"}
              </h4>

              <p>
                {matchedItem?.loadingLocation ||
                  "-"}
              </p>
            </div>
          </div>

          {/* ORDERED QTY */}

          <div className={styles.centerCell}>
            {orderedQty}
          </div>

          {/* SHIPPED QTY */}

          <div className={styles.centerCell}>
            {shippedQty}
          </div>

          {/* PRICE */}

          <div className={styles.centerCell}>
            ₹{" "}
            {pricePerMT.toLocaleString()}
          </div>

          {/* TAXABLE */}

          <div className={styles.centerCell}>
            ₹{" "}
            {taxableAmount.toLocaleString(
              "en-IN",
              {
                maximumFractionDigits: 2,
              }
            )}
          </div>

          {/* GST */}

          {gstType === "igst" ? (
            <div className={styles.centerCell}>
              ₹{" "}
              {igstAmount.toLocaleString(
                "en-IN",
                {
                  maximumFractionDigits: 2,
                }
              )}
            </div>
          ) : (
            <>
              <div
                className={
                  styles.centerCell
                }
              >
                ₹{" "}
                {cgstAmount.toLocaleString(
                  "en-IN",
                  {
                    maximumFractionDigits: 2,
                  }
                )}
              </div>

              <div
                className={
                  styles.centerCell
                }
              >
                ₹{" "}
                {sgstAmount.toLocaleString(
                  "en-IN",
                  {
                    maximumFractionDigits: 2,
                  }
                )}
              </div>
            </>
          )}

          {/* TOTAL */}

          <div className={styles.centerCell}>
            ₹{" "}
            {totalAmount.toLocaleString(
              "en-IN",
              {
                maximumFractionDigits: 2,
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentItemsSection;