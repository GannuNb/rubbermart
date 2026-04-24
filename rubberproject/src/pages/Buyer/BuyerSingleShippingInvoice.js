import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../styles/Buyer/BuyerSingleShippingInvoice.module.css";

import InvoiceHeaderSection from "../../components/Buyer/Invoice/InvoiceHeaderSection";
import ShipmentProgressSection from "../../components/Buyer/Invoice/ShipmentProgressSection";
import DriverShipmentSummarySection from "../../components/Buyer/Invoice/DriverShipmentSummarySection";
import ShipmentItemsSection from "../../components/Buyer/Invoice/ShipmentItemsSection";
import ShipmentTrackingActionsSection from "../../components/Buyer/Invoice/ShipmentTrackingActionsSection";

const BuyerSingleShippingInvoice = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const shipment = location.state?.shipment;
  const order = location.state?.order;

  if (!shipment || !order) {
    return (
      <div className={styles.container}>
        <h2>Shipment details not found</h2>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button
        className={styles.backButton}
        onClick={() => navigate(-1)}
      >
        ← Back to Shipping Details
      </button>

      {/* Header */}
      <InvoiceHeaderSection
        shipment={shipment}
        order={order}
      />

      {/* Progress */}
      <ShipmentProgressSection
        shipment={shipment}
        order={order}
      />

      {/* Driver + Shipment Summary */}
      <DriverShipmentSummarySection
        shipment={shipment}
      />

      {/* Items in Shipment */}
      <ShipmentItemsSection
        shipment={shipment}
        order={order}
      />

      {/* Tracking + Actions */}
      <ShipmentTrackingActionsSection
        shipment={shipment}
      />
    </div>
  );
};

export default BuyerSingleShippingInvoice;