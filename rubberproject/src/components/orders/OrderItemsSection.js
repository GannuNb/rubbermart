import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Buyer/BuyerOrderDetails.module.css";

function OrderItemsSection({ order }) {
  const navigate = useNavigate();

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

  const getItemProgress = (item) => {
    const approvedShipments =
      order.shipments?.filter(
        (shipment) =>
          shipment.approvedByAdmin === true &&
          shipment.selectedItem === item.productName,
      ) || [];

    const shippedQty = approvedShipments.reduce(
      (total, shipment) => total + Number(shipment.shippedQuantity || 0),
      0,
    );

    const requiredQty = Number(item.requiredQuantity);

    const remainingQty = Math.max(requiredQty - shippedQty, 0);

    if (order.orderStatus === "delivered") {
      return {
        stage: 4,
        label: "Delivered",
        type: "delivered",
        shippedQty,
        remainingQty,
      };
    }

    if (shippedQty === 0) {
      return {
        stage: 1,
        label: "Order Confirmed",
        type: "confirmed",
        shippedQty,
        remainingQty,
      };
    }

    if (shippedQty < requiredQty) {
      return {
        stage: 2,
        label: "Partial Shipment",
        type: "partial",
        shippedQty,
        remainingQty,
      };
    }

    return {
      stage: 3,
      label: "Shipped",
      type: "shipped",
      shippedQty,
      remainingQty: 0,
    };
  };

  const getProgressWidth = (stage) => {
    switch (stage) {
      case 1:
        return "25%";

      case 2:
        return "50%";

      case 3:
        return "75%";

      case 4:
        return "100%";

      default:
        return "0%";
    }
  };

  return (
    <div className={styles.itemsSection}>
      <h3 className={styles.sectionTitle}>Items Ordered & Delivery Details</h3>

      {order.orderItems.map((item, index) => {
        const progress = getItemProgress(item);

        return (
          <div key={index} className={styles.itemCard}>
            <div className={styles.statusRow}>
              <span className={styles.statusBadge}>{progress.label}</span>
            </div>

            <div className={styles.itemRow}>
              <img
                src={getImage(item)}
                alt="product"
                className={styles.itemImage}
              />

              <div className={styles.itemInfo}>
                <h4 className={styles.productName}>{item.productName}</h4>

                <p>Required Quantity / MT : {item.requiredQuantity}</p>

                <p>
                  Remaining Quantity / MT :{" "}
                  <span className={styles.remainingQty}>
                    {progress.remainingQty}
                  </span>
                </p>

                <p>Loading Location : {item.loadingLocation}</p>
              </div>

              <button
                className={styles.shippingBtn}
                onClick={() =>
                  navigate(
                    `/buyer/order/${order._id}/shipping/${encodeURIComponent(
                      item.productName,
                    )}`,
                  )
                }
              >
                View Shipping
              </button>
            </div>

            <div className={styles.progressSection}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: getProgressWidth(progress.stage),
                  }}
                />
              </div>

              <div className={styles.progressLabels}>
                <span>Order Confirmed</span>
                <span>Partial Shipment</span>
                <span>Shipped</span>
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
