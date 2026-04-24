import React from "react";
import { FaTruck } from "react-icons/fa";
import styles from "../../../styles/Buyer/BuyerSingleShippingInvoice.module.css";

const ShipmentProgressSection = ({ shipment, order }) => {
  const isDelivered =
    shipment?.shipmentStatus === "delivered";

  const getProgressMessage = () => {
    if (isDelivered) {
      return "Your shipment has been successfully delivered";
    }

    return "Your shipment is in transit and will be delivered soon";
  };

  return (
    <div className={styles.progressCard}>
      <h3 className={styles.sectionTitle}>
        Shipment Progress
      </h3>

      <div className={styles.progressWrapper}>
        {/* LINE */}
        <div className={styles.progressLine}></div>

        {/* STEPS */}
        <div className={styles.progressSteps}>
          {/* STEP 1 */}
          <div className={styles.step}>
            <div className={styles.activeCircle}></div>

            <h4>Order Confirmed</h4>

            <p>
              {order?.createdAt
                ? new Date(order.createdAt).toLocaleString()
                : "-"}
            </p>
          </div>

          {/* STEP 2 */}
          <div className={styles.step}>
            <div className={styles.activeCircle}></div>

            <h4>Shipment Date</h4>

            <p>
              {shipment?.shippedAt
                ? new Date(
                    shipment.shippedAt
                  ).toLocaleString()
                : "-"}
            </p>
          </div>

          {/* STEP 3 */}
          <div className={styles.step}>
            <div
              className={
                isDelivered
                  ? styles.activeCircle
                  : styles.inactiveCircle
              }
            ></div>

            <h4>Delivered</h4>

            <p>
              {shipment?.deliveredAt
                ? new Date(
                    shipment.deliveredAt
                  ).toLocaleString()
                : "Pending"
              }
            </p>
          </div>
        </div>
      </div>

      {/* BOTTOM MESSAGE */}
      <div className={styles.progressMessage}>
        <FaTruck
          style={{
            marginRight: "10px",
            color: "#6d28d9",
          }}
        />
        {getProgressMessage()}
      </div>
    </div>
  );
};

export default ShipmentProgressSection;