// src/pages/Buyer/BuyerSingleShippingInvoice.js

import React, { useEffect } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  useDispatch,
  useSelector,
} from "react-redux";

import styles from "../../styles/Buyer/BuyerSingleShippingInvoice.module.css";

import InvoiceHeaderSection from "../../components/Buyer/Invoice/InvoiceHeaderSection";
import ShipmentProgressSection from "../../components/Buyer/Invoice/ShipmentProgressSection";
import DriverShipmentSummarySection from "../../components/Buyer/Invoice/DriverShipmentSummarySection";
import ShipmentItemsSection from "../../components/Buyer/Invoice/ShipmentItemsSection";
import ShipmentTrackingActionsSection from "../../components/Buyer/Invoice/ShipmentTrackingActionsSection";

import {
  getBuyerSingleOrderThunk,
} from "../../redux/slices/buyerOrderThunk";

const BuyerSingleShippingInvoice = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    shipmentId,
    orderId,
  } = useParams();

  const {
    singleOrder,
    singleOrderLoading,
    singleOrderError,
  } = useSelector(
    (state) => state.buyerOrders
  );

  const order = singleOrder;

  /* =========================
     FETCH FRESH ORDER
  ========================= */

  useEffect(() => {
    if (orderId) {
      dispatch(
        getBuyerSingleOrderThunk(
          orderId
        )
      );
    }
  }, [dispatch, orderId]);

  /* =========================
     FIND SHIPMENT FROM ORDER
  ========================= */

  const shipment =
    order?.shipments?.find(
      (item) =>
        item?._id === shipmentId
    );

  /* =========================
     LOADING
  ========================= */

  if (singleOrderLoading) {
    return (
      <div className={styles.container}>
        Loading shipment details...
      </div>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (singleOrderError) {
    return (
      <div className={styles.container}>
        {singleOrderError}
      </div>
    );
  }

  /* =========================
     SAFETY CHECK
  ========================= */

  if (!shipment || !order) {
    return (
      <div className={styles.container}>
        <h2>
          Shipment details not found
        </h2>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button
        className={styles.backButton}
        onClick={() =>
          navigate(-1)
        }
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
        order={order}
      />
    </div>
  );
};

export default BuyerSingleShippingInvoice;