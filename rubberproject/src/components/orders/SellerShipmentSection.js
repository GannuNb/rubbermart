import React from "react";
import SellerShipmentForm from "../SellerShipment/SellerShipmentForm";
import ShipmentCard from "./ShipmentCard";
import styles from "../../styles/Seller/SellerShipmentSection.module.css";

const SellerShipmentSection = ({ selectedOrder }) => {
  return (
    <div className={styles.section}>
      <h2 className={styles.heading}>Shipment Details</h2>

      <SellerShipmentForm selectedOrder={selectedOrder} />

      {selectedOrder.shipments?.length > 0 ? (
        <div className={styles.shipmentGrid}>
          {selectedOrder.shipments.map((shipment) => (
            <ShipmentCard
              key={shipment._id}
              shipment={shipment}
              orderId={selectedOrder._id}
            />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          No shipment / weight ticket details added yet
        </div>
      )}
    </div>
  );
};

export default SellerShipmentSection;
