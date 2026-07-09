import { invoiceColors } from "../../styles.js";

const {
  primaryPurple,
  borderColor,
  darkText,
  lightText,
} = invoiceColors;

export const drawShipmentSection = (
  doc,
  order,
  shipmentQuotes = [],
  startY,
) => {
  let y = startY;

  /* =====================================
      TITLE
  ===================================== */

  doc
    .roundedRect(35, y, 525, 24, 4)
    .fill(primaryPurple);

  doc
    .fillColor("#ffffff")
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("SHIPMENT HISTORY", 48, y + 7);

  y += 35;

  if (!order?.shipments?.length) {
    doc
      .font("Helvetica")
      .fillColor(darkText)
      .fontSize(10)
      .text("No shipment records available.", 45, y);

    return y + 30;
  }

  order.shipments.forEach((shipment, index) => {
    /* ==========================
   DYNAMIC CARD HEIGHT
========================== */

const buyerPayments =
  shipment.transportPaymentReceipts || [];

const adminPayments =
  shipment.adminTransportPaymentReceipts || [];

// Take the larger payment list
const maxPaymentRows = Math.max(
  buyerPayments.length,
  adminPayments.length,
  1
);

// Height needed for payment section
const paymentSectionHeight =
  45 + maxPaymentRows * 18;

// Total shipment card height
const cardHeight =
  205 + paymentSectionHeight;
    /* =====================================
        SHIPMENT CARD
    ===================================== */

    doc
      .roundedRect(35, y, 525, cardHeight, 6)
      .lineWidth(0.7)
      .strokeColor(borderColor)
      .stroke();

    /* ==========================
        CARD TITLE
    ========================== */

    doc
      .fillColor(primaryPurple)
      .font("Helvetica-Bold")
      .fontSize(10)
      .text(`Shipment ${index + 1}`, 48, y + 12);

    let rowY = y + 32;

    const drawRow = (
      leftLabel,
      leftValue,
      rightLabel,
      rightValue,
    ) => {
      doc
        .fillColor(lightText)
        .font("Helvetica-Bold")
        .fontSize(8)
        .text(leftLabel, 50, rowY);

      doc
        .fillColor(darkText)
        .font("Helvetica")
        .text(leftValue || "-", 165, rowY);

      doc
        .fillColor(lightText)
        .font("Helvetica-Bold")
        .text(rightLabel, 315, rowY);

      doc
        .fillColor(darkText)
        .font("Helvetica")
        .text(rightValue || "-", 455, rowY);

      rowY += 18;
    };

    const formatDate = (date) => {
      if (!date) return "-";
      return new Date(date).toLocaleString("en-IN");
    };

    drawRow(
      "Shipment Invoice",
      shipment.shipmentInvoiceId,
      "Shipment Status",
      shipment.shipmentStatus,
    );

    drawRow(
      "Transport Status",
      shipment.transportStatus,
      "Transporter",
      shipment?.assignedTransporter?.fullName,
    );

    drawRow(
      "Shipment From",
      shipment.shipmentFrom,
      "Shipment To",
      shipment.shipmentTo,
    );

    drawRow(
      "Quantity",
      `${shipment.shippedQuantity || 0} MT`,
      "Transport Amount",
      `${Number(
        shipment.transportFinalAmount || 0,
      ).toLocaleString("en-IN")}`,
    );

    drawRow(
      "Packed",
      formatDate(shipment.packedAt),
      "Assigned",
      formatDate(shipment.assignedAt),
    );

    drawRow(
      "Picked Up",
      formatDate(shipment.pickedUpAt),
      "Delivered",
      formatDate(shipment.deliveredAt),
    );

    drawRow(
      "Estimated Days",
      shipment.estimatedDeliveryDays?.toString(),
      "GST",
      `${shipment.transportGSTPercent || 0}%`,
    );

    /* ==========================
        SELECTED QUOTE
    ========================== */

    const selectedQuote = shipmentQuotes.find(
      (q) =>
        String(q.shipmentId) === String(shipment._id) &&
        q.quoteStatus === "selected",
    );

    doc
      .fillColor(primaryPurple)
      .font("Helvetica-Bold")
      .fontSize(9)
      .text("Selected Transport Quote", 50, rowY + 5);

    rowY += 22;

    if (selectedQuote) {
      drawRow(
        "Quoted Price",
        `${Number(
          selectedQuote.quotedPrice || 0,
        ).toLocaleString("en-IN")}`,
        "Delivery Days",
        selectedQuote.estimatedDeliveryDays?.toString(),
      );
    } else {
      doc
        .fillColor(darkText)
        .font("Helvetica")
        .fontSize(8)
        .text("No transporter quote selected.", 50, rowY);

      rowY += 18;
    }

    /* ==========================
        BUYER TRANSPORT PAYMENT
    ========================== */

    doc
      .fillColor(primaryPurple)
      .font("Helvetica-Bold")
      .fontSize(9)
      .text("Buyer Transport Payments", 50, rowY + 8);

    rowY += 22;

    shipment.transportPaymentReceipts?.forEach((payment) => {
      doc
        .fillColor(darkText)
        .font("Helvetica")
        .fontSize(8)
        .text(
          ` ${payment.amount} | ${payment.paymentMode} | ${payment.status}`,
          60,
          rowY,
        );

      rowY += 15;
    });

    if (!shipment.transportPaymentReceipts?.length) {
      doc
        .font("Helvetica")
        .fontSize(8)
        .text("-", 60, rowY);

      rowY += 15;
    }

    /* ==========================
        ADMIN PAYMENT
    ========================== */

    doc
      .fillColor(primaryPurple)
      .font("Helvetica-Bold")
      .fontSize(9)
      .text("Admin → Transporter Payments", 50, rowY + 5);

    rowY += 22;

    shipment.adminTransportPaymentReceipts?.forEach(
      (payment) => {
        doc
          .fillColor(darkText)
          .font("Helvetica")
          .fontSize(8)
          .text(
            ` ${payment.amount} | ${payment.paymentMode} | ${payment.status}`,
            60,
            rowY,
          );

        rowY += 15;
      },
    );

    if (!shipment.adminTransportPaymentReceipts?.length) {
      doc
        .font("Helvetica")
        .fontSize(8)
        .text("-", 60, rowY);
    }

    y += cardHeight + 15;
  });

  return y;
};