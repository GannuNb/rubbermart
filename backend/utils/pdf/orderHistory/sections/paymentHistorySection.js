import { invoiceColors } from "../../styles.js";

const {
  primaryPurple,
  borderColor,
  darkText,
} = invoiceColors;

export const drawPaymentHistorySection = (
  doc,
  order,
  startY,
) => {
  let y = startY;

  /* ==========================================
      BUYER → ADMIN PAYMENT HISTORY
  ========================================== */

  doc
    .roundedRect(35, y, 525, 24, 4)
    .fill(primaryPurple);

  doc
    .fillColor("#ffffff")
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("BUYER PAYMENT HISTORY", 48, y + 7);

  y += 32;

  drawPaymentTable(doc, order?.buyerPaymentReceipts || [], y);

  y += Math.max((order?.buyerPaymentReceipts?.length || 1) * 26 + 35, 65);

  /* ==========================================
      ADMIN → SELLER PAYMENT HISTORY
  ========================================== */

  doc
    .roundedRect(35, y, 525, 24, 4)
    .fill(primaryPurple);

  doc
    .fillColor("#ffffff")
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("ADMIN TO SELLER PAYMENT HISTORY", 48, y + 7);

  y += 32;

  drawPaymentTable(doc, order?.sellerPaymentReceipts || [], y);

  y += Math.max((order?.sellerPaymentReceipts?.length || 1) * 26 + 35, 65);

  return y;
};

/* ======================================================
    COMMON PAYMENT TABLE
====================================================== */

function drawPaymentTable(doc, payments, y) {
  const columns = [
    { label: "#", x: 38, width: 25 },
    { label: "Amount", x: 63, width: 70 },
    { label: "Mode", x: 133, width: 70 },
    { label: "Transaction", x: 203, width: 95 },
    { label: "Status", x: 298, width: 65 },
    { label: "Uploaded", x: 363, width: 90 },
    { label: "Verified", x: 453, width: 90 },
  ];

  /* =========================
      HEADER
  ========================= */

  doc.rect(35, y, 525, 22).fill("#ECE8FF");

  doc
    .fillColor("#000000")
    .font("Helvetica-Bold")
    .fontSize(8);

  columns.forEach((column) => {
    doc.text(column.label, column.x, y + 7, {
      width: column.width,
      align: "center",
    });
  });

  y += 22;

  /* =========================
      NO PAYMENTS
  ========================= */

  if (!payments.length) {
    doc
      .rect(35, y, 525, 25)
      .strokeColor(borderColor)
      .stroke();

    doc
      .fillColor(darkText)
      .font("Helvetica")
      .fontSize(8)
      .text(
        "No payment records available.",
        0,
        y + 8,
        {
          width: 595,
          align: "center",
        },
      );

    return;
  }

  /* =========================
      ROWS
  ========================= */

  payments.forEach((payment, index) => {
    doc
      .rect(35, y, 525, 26)
      .strokeColor(borderColor)
      .lineWidth(0.5)
      .stroke();

    doc
      .fillColor(darkText)
      .font("Helvetica")
      .fontSize(7.5);

    doc.text(index + 1, 38, y + 8, {
      width: 25,
      align: "center",
    });

    doc.text(
      `${Number(payment.amount || 0).toLocaleString("en-IN")}`,
      63,
      y + 8,
      {
        width: 70,
        align: "center",
      },
    );

    doc.text(
      payment.paymentMode || "-",
      133,
      y + 8,
      {
        width: 70,
        align: "center",
      },
    );

    doc.text(
      payment.transactionId || "-",
      203,
      y + 8,
      {
        width: 95,
        align: "center",
      },
    );

    doc.text(
      payment.status || "-",
      298,
      y + 8,
      {
        width: 65,
        align: "center",
      },
    );

    doc.text(
      payment.uploadedAt
        ? new Date(payment.uploadedAt).toLocaleDateString("en-IN")
        : "-",
      363,
      y + 8,
      {
        width: 90,
        align: "center",
      },
    );

    doc.text(
      payment.verifiedAt
        ? new Date(payment.verifiedAt).toLocaleDateString("en-IN")
        : "-",
      453,
      y + 8,
      {
        width: 90,
        align: "center",
      },
    );

    y += 26;
  });
}