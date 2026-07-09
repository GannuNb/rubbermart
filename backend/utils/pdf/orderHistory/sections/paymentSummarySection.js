import { invoiceColors } from "../../styles.js";

const {
  primaryPurple,
  borderColor,
  darkText,
  lightText,
} = invoiceColors;

export const drawPaymentSummarySection = (
  doc,
  order,
  startY,
) => {
  let y = startY;

  /* =========================
      SECTION TITLE
  ========================= */

  doc
    .roundedRect(35, y, 525, 24, 4)
    .fill(primaryPurple);

  doc
    .fillColor("#ffffff")
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("PAYMENT SUMMARY", 48, y + 7);

  y += 35;

  /* =========================
      SUMMARY BOX
  ========================= */

  doc
    .roundedRect(35, y, 525, 165, 5)
    .lineWidth(0.7)
    .strokeColor(borderColor)
    .stroke();

  const leftLabelX = 50;
  const leftValueX = 175;

  const rightLabelX = 320;
  const rightValueX = 470;

  let rowY = y + 18;

  const formatAmount = (amount) =>
    `${Number(amount || 0).toLocaleString("en-IN")}`;

  const drawRow = (
    leftLabel,
    leftValue,
    rightLabel,
    rightValue,
    currentY,
  ) => {
    doc
      .fillColor(lightText)
      .font("Helvetica-Bold")
      .fontSize(9)
      .text(leftLabel, leftLabelX, currentY);

    doc
      .fillColor(darkText)
      .font("Helvetica")
      .text(leftValue, leftValueX, currentY);

    doc
      .fillColor(lightText)
      .font("Helvetica-Bold")
      .text(rightLabel, rightLabelX, currentY);

    doc
      .fillColor(darkText)
      .font("Helvetica")
      .text(rightValue, rightValueX, currentY);
  };

  drawRow(
    "Taxable Amount",
    formatAmount(order?.taxableAmount),
    "Total Amount",
    formatAmount(order?.totalAmount),
    rowY,
  );

  rowY += 22;

  drawRow(
    "GST Type",
    order?.gstType?.toUpperCase() || "-",
    "GST Amount",
    formatAmount(order?.gstAmount),
    rowY,
  );

  rowY += 22;

  drawRow(
    "Buyer Paid",
    formatAmount(order?.buyerPaidAmount),
    "Buyer Pending",
    formatAmount(order?.buyerPendingAmount),
    rowY,
  );

  rowY += 22;

  drawRow(
    "Seller Paid",
    formatAmount(order?.sellerPaidAmount),
    "Seller Pending",
    formatAmount(order?.sellerPendingAmount),
    rowY,
  );

  rowY += 22;

  drawRow(
    "Buyer Status",
    order?.buyerPaymentStatus || "-",
    "Seller Status",
    order?.sellerPaymentStatus || "-",
    rowY,
  );

  rowY += 22;

  drawRow(
    "CGST",
    formatAmount(order?.cgstAmount),
    "SGST",
    formatAmount(order?.sgstAmount),
    rowY,
  );

  rowY += 22;

  drawRow(
    "IGST",
    formatAmount(order?.igstAmount),
    "",
    "",
    rowY,
  );

  return y + 185;
};