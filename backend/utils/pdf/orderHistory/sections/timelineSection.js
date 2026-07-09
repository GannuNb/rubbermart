import { invoiceColors } from "../../styles.js";

const {
  primaryPurple,
  borderColor,
  darkText,
  lightText,
} = invoiceColors;

export const drawTimelineSection = (
  doc,
  order,
  startY,
) => {
  let y = startY;

  /* =========================
      TITLE
  ========================= */

  doc
    .roundedRect(35, y, 525, 24, 4)
    .fill(primaryPurple);

  doc
    .fillColor("#ffffff")
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("ORDER TIMELINE", 48, y + 7);

  y += 38;

  /* =========================
      EVENTS
  ========================= */

  /* =========================
   SHIPMENT DATE HELPERS
========================= */

const shipments = order?.shipments || [];

const getEarliestDate = (field) => {
  const dates = shipments
    .map((shipment) => shipment[field])
    .filter(Boolean)
    .sort((a, b) => new Date(a) - new Date(b));

  return dates.length ? dates[0] : null;
};

const getLatestDate = (field) => {
  const dates = shipments
    .map((shipment) => shipment[field])
    .filter(Boolean)
    .sort((a, b) => new Date(b) - new Date(a));

  return dates.length ? dates[0] : null;
};

  const events = [];

  const addEvent = (label, date) => {
    if (date) {
      events.push({
        label,
        date,
      });
    }
  };

  addEvent("Order Created", order.createdAt);

  addEvent("Seller Confirmed", order.sellerConfirmedAt);

if (shipments.length > 0) {
  addEvent(
    "Shipment Created",
    getEarliestDate("createdAt")
  );

  addEvent(
    "Transporter Assigned",
    getEarliestDate("assignedAt")
  );

  addEvent(
    "Shipment Picked Up",
    getEarliestDate("pickedUpAt")
  );

  addEvent(
    "Shipment In Transit",
    getEarliestDate("inTransitAt")
  );

  addEvent(
    "Shipment Delivered",
    getLatestDate("deliveredAt")
  );
}



  addEvent("Order Completed", order.completedAt);

  addEvent("Order Cancelled", order.cancelledAt);

  /* =========================
      DYNAMIC BOX HEIGHT
  ========================= */

  const rowHeight = 30;

  const cardHeight =
    20 + events.length * rowHeight + 15;

  doc
    .roundedRect(35, y, 525, cardHeight, 5)
    .lineWidth(0.7)
    .strokeColor(borderColor)
    .stroke();

  /* =========================
      DATE FORMAT
  ========================= */

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  let rowY = y + 18;

  events.forEach((event, index) => {
    /* Vertical line */

    if (index !== events.length - 1) {
      doc
        .moveTo(65, rowY + 8)
        .lineTo(65, rowY + 30)
        .lineWidth(1)
        .strokeColor("#BDBDBD")
        .stroke();
    }

    /* Circle */

    doc
      .circle(65, rowY + 5, 4)
      .fill(primaryPurple);

    /* Event Name */

    doc
      .fillColor(darkText)
      .font("Helvetica-Bold")
      .fontSize(9)
      .text(event.label, 82, rowY);

    /* Event Date */

    doc
      .fillColor(lightText)
      .font("Helvetica")
      .fontSize(8)
      .text(
        formatDate(event.date),
        300,
        rowY,
      );

    rowY += rowHeight;
  });

  return y + cardHeight + 20;
};