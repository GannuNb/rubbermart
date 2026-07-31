// src/utils/orderStatusHelpers.js

export const getShipmentDetails = (order) => {

  const shipments = (order.shipments || []).filter(
    (shipment) =>
      shipment.shipmentStatus === "shipped" ||
      shipment.shipmentStatus === "in_transit" ||
      shipment.shipmentStatus === "delivered" ||
      shipment.shipmentStatus === "completed"
  );

  const totalShippedQuantity = shipments.reduce(
    (total, shipment) =>
      total + Number(shipment.shippedQuantity || 0),
    0
  );

  const totalRequiredQuantity = order.orderItems.reduce(
    (total, item) =>
      total + Number(item.requiredQuantity || 0),
    0
  );

  return {
    shipments,
    totalShippedQuantity,
    totalRequiredQuantity,
  };
};

/* =========================
   DISPLAY STATUS
========================= */

export const getDisplayStatus = (order) => {
  const {
    shipments,
    totalShippedQuantity,
    totalRequiredQuantity,
  } = getShipmentDetails(order);

  if (order.orderStatus === "cancelled") return "Cancelled";

  if (
    order.orderStatus === "delivered" ||
    order.orderStatus === "completed"
  ) {
    return "Delivered";
  }

  // ✅ FULL SHIPPED
  if (
    shipments.length > 0 &&
    totalShippedQuantity >= totalRequiredQuantity
  ) {
    return "Shipped";
  }

  // ✅ PARTIAL SHIPPED
  if (
    shipments.length > 0 &&
    totalShippedQuantity < totalRequiredQuantity
  ) {
    return "Partial Shipment";
  }

  // ✅ ORDER CONFIRMED (before shipment)
if (order.orderStatus === "seller_confirmed") {
  return "Confirmed Order";
}

  return "Placed Order";
};

/* =========================
   PROGRESS BAR
========================= */

export const getProgressClass = (order, styles) => {
  const {
    shipments,
    totalShippedQuantity,
    totalRequiredQuantity,
  } = getShipmentDetails(order);

  if (order.orderStatus === "cancelled") {
  return styles.cancelledProgress;
}

if (
  order.orderStatus === "delivered" ||
  order.orderStatus === "completed"
) {
  return styles.fullProgress;
}

  if (
    shipments.length > 0 &&
    totalShippedQuantity >= totalRequiredQuantity
  ) {
    return styles.shippedProgress;
  }

  if (
    shipments.length > 0 &&
    totalShippedQuantity < totalRequiredQuantity
  ) {
    return styles.partialProgress;
  }

 if (order.orderStatus === "seller_confirmed") {
  return styles.confirmedProgress;
}

  return styles.pendingProgress;
};

/* =========================
   PROGRESS LABELS
========================= */

export const getProgressLabels = (order) => {
  const {
    shipments,
    totalShippedQuantity,
    totalRequiredQuantity,
  } = getShipmentDetails(order);

  if (
    order.orderStatus === "delivered" ||
    order.orderStatus === "completed"
  ) {
    return [
      "Placed Order",
      "Confirmed Order",
      "Shipped",
      "Delivered",
    ];
  }

  if (
    shipments.length > 0 &&
    totalShippedQuantity >= totalRequiredQuantity
  ) {
    return [
      "Placed Order",
      "Confirmed Order",
      "Shipped",
      "Delivery Pending",
    ];
  }

  if (
    shipments.length > 0 &&
    totalShippedQuantity < totalRequiredQuantity
  ) {
    return [
      "Placed Order",
      "Confirmed Order",
      "Partial Shipment",
      "Delivery Pending",
    ];
  }

  if (order.orderStatus === "seller_confirmed") {
  return [
    "Placed Order",
    "Seller Confirmed the Order✅",
    "Shipment Pending",
    "Delivery Pending",
  ];
}

  return [
    "Placed Order",
    "Waiting for Seller Order Confirmation",
    "Shipment Pending",
    "Delivery Pending",
  ];
};