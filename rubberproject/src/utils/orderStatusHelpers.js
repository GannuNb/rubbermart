// src/utils/orderStatusHelpers.js

export const getShipmentDetails = (order) => {
  const approvedShipments =
    order.shipments?.filter(
      (shipment) => shipment.approvedByAdmin === true,
    ) || [];

  const totalApprovedQuantity = approvedShipments.reduce(
    (total, shipment) =>
      total + Number(shipment.shippedQuantity || 0),
    0,
  );

  const totalRequiredQuantity = order.orderItems.reduce(
    (total, item) =>
      total + Number(item.requiredQuantity || 0),
    0,
  );

  return {
    approvedShipments,
    totalApprovedQuantity,
    totalRequiredQuantity,
  };
};

export const getDisplayStatus = (order) => {
  const {
    approvedShipments,
    totalApprovedQuantity,
    totalRequiredQuantity,
  } = getShipmentDetails(order);

  if (order.orderStatus === "cancelled") return "Cancelled";

  if (
    order.orderStatus === "delivered" ||
    order.orderStatus === "completed"
  ) {
    return "Delivered";
  }

  if (
    approvedShipments.length > 0 &&
    totalApprovedQuantity >= totalRequiredQuantity
  ) {
    return "Shipped";
  }

  if (
    approvedShipments.length > 0 &&
    totalApprovedQuantity < totalRequiredQuantity
  ) {
    return "Partial Shipment";
  }

  if (
    order.orderStatus === "seller_confirmed" ||
    order.orderStatus === "partially_shipped" ||
    order.orderStatus === "shipped"
  ) {
    return "Confirmed Order";
  }

  return "Placed Order";
};

export const getProgressClass = (order, styles) => {
  const {
    approvedShipments,
    totalApprovedQuantity,
    totalRequiredQuantity,
  } = getShipmentDetails(order);

  if (
    order.orderStatus === "delivered" ||
    order.orderStatus === "completed"
  ) {
    return styles.fullProgress;
  }

  if (
    approvedShipments.length > 0 &&
    totalApprovedQuantity >= totalRequiredQuantity
  ) {
    return styles.shippedProgress;
  }

  if (
    approvedShipments.length > 0 &&
    totalApprovedQuantity < totalRequiredQuantity
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

export const getProgressLabels = (order) => {
  const {
    approvedShipments,
    totalApprovedQuantity,
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
    approvedShipments.length > 0 &&
    totalApprovedQuantity >= totalRequiredQuantity
  ) {
    return [
      "Placed Order",
      "Confirmed Order",
      "Shipped",
      "Delivered Pending",
    ];
  }

  if (
    approvedShipments.length > 0 &&
    totalApprovedQuantity < totalRequiredQuantity
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