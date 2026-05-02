// src/utils/orderStatusHelpers.js

export const getShipmentDetails = (order) => {
  // ✅ REMOVED admin approval dependency
  const shipments = order.shipments || [];

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
  if (
    order.orderStatus === "seller_confirmed" ||
    order.orderStatus === "partially_shipped" ||
    order.orderStatus === "shipped"
  ) {
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

  if (
    order.orderStatus === "seller_confirmed" ||
    order.orderStatus === "partially_shipped" ||
    order.orderStatus === "shipped"
  ) {
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
      "Delivered Pending",
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
      "Delivered Pending",
    ];
  }

  if (
    order.orderStatus === "seller_confirmed" ||
    order.orderStatus === "partially_shipped" ||
    order.orderStatus === "shipped"
  ) {
    return [
      "Placed Order",
      "Confirmed Order",
      "Shipment Pending",
      "Delivered Pending",
    ];
  }

  return [
    "Placed Order",
    "Waiting Seller",
    "Shipment Pending",
    "Delivered Pending",
  ];
};