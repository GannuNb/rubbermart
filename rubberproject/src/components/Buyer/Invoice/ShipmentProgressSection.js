// src/components/Buyer/Invoice/ShipmentProgressSection.js

import React, { useState } from "react";
import { FaTruck, FaChevronDown } from "react-icons/fa";
import styles from "../../../styles/Buyer/BuyerSingleShippingInvoice.module.css";

const ShipmentProgressSection = ({ shipment, order }) => {
  const [isOpen, setIsOpen] = useState(true); // Control accordion dropdown state
  
  const isDelivered = shipment?.shipmentStatus === "delivered";
  const isPickedUp = shipment?.pickedUpAt ? true : false;
  const progressWidth = isDelivered ? "100%" : isPickedUp ? "65%" : "30%";

  const getProgressMessage = () => {
    if (isDelivered) {
      return "Your shipment has been successfully delivered";
    }
    if (isPickedUp) {
      return "Your shipment is in transit and will be delivered soon";
    }
    return "Your order has been confirmed and shipment is being prepared";
  };

  return (
    <div className={styles.progressCard} style={{ padding: "0", overflow: "hidden" }}>
      {/* ACCORDION HEADER TRIGGER */}
      <div 
        className={styles.dropdownHeader}
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          cursor: "pointer", 
          userSelect: "none", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          padding: "20px 24px"
        }}
      >
        <h3 className={styles.sectionTitle} style={{ margin: "0" }}>Shipment Progress</h3>
        <FaChevronDown 
          style={{ 
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", 
            transition: "transform 0.2s ease", 
            color: "#6d28d9",
            fontSize: "16px" 
          }} 
        />
      </div>

      {/* COLLAPSIBLE ACCORDION BODY CONTENT */}
      {isOpen && (
        <div style={{ padding: "0 24px 24px 24px" }}>
          <div className={styles.progressWrapper}>
            {/* LINE */}
            <div className={styles.progressLine}>
              <div
                className={styles.progressFill}
                style={{
                  width: progressWidth,
                }}
              />
            </div>

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
                <div
                  className={
                    isPickedUp ? styles.activeCircle : styles.inactiveCircle
                  }
                ></div>
                <h4>Shipment Date</h4>
                <p>
                  {shipment?.pickedUpAt
                    ? new Date(shipment.pickedUpAt).toLocaleString()
                    : "Pending"}
                </p>
              </div>

              {/* STEP 3 */}
              <div className={styles.step}>
                <div
                  className={
                    isDelivered ? styles.activeCircle : styles.inactiveCircle
                  }
                ></div>
                <h4>Delivered</h4>
                <p>
                  {shipment?.deliveredAt
                    ? new Date(shipment.deliveredAt).toLocaleString()
                    : "Pending"}
                </p>
              </div>
            </div>
          </div>

          {/* MESSAGE */}
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
      )}
    </div>
  );
};

export default ShipmentProgressSection;