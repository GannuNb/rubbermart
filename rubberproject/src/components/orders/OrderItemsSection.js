import React from "react";
import styles from "../../styles/Buyer/BuyerOrderDetails.module.css";

function OrderItemsSection({ order }) {
  // ✅ IMAGE HANDLER
  const getImage = (item) => {
    if (item?.productImage?.data) {
      let base64 = "";

      if (typeof item.productImage.data === "string") {
        base64 = item.productImage.data;
      } else if (item.productImage.data?.data) {
        base64 = btoa(
          new Uint8Array(item.productImage.data.data).reduce(
            (d, b) => d + String.fromCharCode(b),
            "",
          ),
        );
      }

      return `data:${
        item.productImage.contentType || "image/jpeg"
      };base64,${base64}`;
    }

    return "/logo192.png";
  };

  // ✅ CORE LOGIC
  const getItemProgress = (item) => {
    const approvedShipments =
      order.shipments?.filter(
        (s) =>
          s.approvedByAdmin === true &&
          s.selectedItem === item.productName,
      ) || [];

    const shippedQty = approvedShipments.reduce(
      (sum, s) => sum + Number(s.shippedQuantity || 0),
      0,
    );

    const requiredQty = Number(item.requiredQuantity);

    const remainingQty = Math.max(requiredQty - shippedQty, 0);

    // ✅ DELIVERED
    if (order.orderStatus === "delivered") {
      return {
        stage: 3,
        label: "Delivered",
        type: "delivered",
        shippedQty,
        remainingQty,
      };
    }

    // ✅ NO SHIPMENT
    if (shippedQty === 0) {
      return {
        stage: 1,
        label: "Order Confirmed",
        type: "confirmed",
        shippedQty,
        remainingQty,
      };
    }

    // ✅ PARTIAL
    if (shippedQty < requiredQty) {
      return {
        stage: 2,
        label: "Partial Shipment",
        type: "partial",
        shippedQty,
        remainingQty,
      };
    }

    // ✅ FULL SHIPPED
    return {
      stage: 3,
      label: "Shipped",
      type: "shipped",
      shippedQty,
      remainingQty: 0,
    };
  };

  // ✅ PROGRESS WIDTH
  const getProgressWidth = (stage) => {
    switch (stage) {
      case 1:
        return "33%";
      case 2:
        return "66%";
      case 3:
        return "100%";
      default:
        return "0%";
    }
  };

  return (
    <div className={styles.itemsSection}>
      <h3 className={styles.sectionTitle}>
        Items Ordered & Delivery Details
      </h3>

      {order.orderItems.map((item, index) => {
        const progress = getItemProgress(item);

        return (
          <div key={index} className={styles.itemCard}>
            {/* STATUS BADGE */}
            <div className={styles.statusRow}>
              <span className={styles.statusBadge}>
                {progress.label}
              </span>
            </div>

            {/* MAIN ROW */}
            <div className={styles.itemRow}>
              {/* IMAGE */}
              <img
                src={getImage(item)}
                alt="product"
                className={styles.itemImage}
              />

              {/* INFO */}
              <div className={styles.itemInfo}>
                {/* ✅ COLORED PRODUCT NAME */}
                <h4 className={styles.productName}>
                  {item.productName}
                </h4>

                <p>
                  Required Quantity / MT :{" "}
                  {item.requiredQuantity}
                </p>

                {/* ✅ NEW FIELD */}
                <p>
                  Remaining Quantity / MT :{" "}
                  <span className={styles.remainingQty}>
                    {progress.remainingQty}
                  </span>
                </p>

                <p>
                  Loading Location : {item.loadingLocation}
                </p>
              </div>

              {/* BUTTON */}
              <button className={styles.shippingBtn}>
                View Shipping
              </button>
            </div>

            {/* PROGRESS BAR */}
            <div className={styles.progressSection}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: getProgressWidth(progress.stage),
                  }}
                />
              </div>

              {/* LABELS */}
              <div className={styles.progressLabels}>
                <span>Order Confirmed</span>

                <span>
                  {progress.type === "partial"
                    ? "Partial Shipment"
                    : "Shipped"}
                </span>

                <span>Delivered</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default OrderItemsSection;