import { invoiceColors } from "../styles.js";

const { primaryPurple, borderColor, darkText } = invoiceColors;

export const drawItemsTable = (doc, order) => {
  const tableTop = 390;
  const rowHeight = 34;

  doc.rect(35, tableTop, 525, 22).fill(primaryPurple);

  doc
    .fillColor("#fff")
    .font("Helvetica-Bold")
    .fontSize(8)
    .text("S.NO", 42, tableTop + 7)
    .text("Item Name", 82, tableTop + 7)
    .text("Req Qty/MT", 160, tableTop + 7)
    .text("Price/MT", 225, tableTop + 7)
    .text("Subtotal", 285, tableTop + 7)
    .text(
      order.gstType === "cgst_sgst"
        ? "CGST + SGST"
        : "IGST",
      340,
      tableTop + 7
    )
    .text("Total", 450, tableTop + 7);

  let currentY = tableTop + 22;

  order.orderItems.forEach((item, index) => {
    const subtotal = Number(item.subtotal || 0);
    const gst =
      Number(item.gstAmount || subtotal * 0.18);

    const total = subtotal + gst;

    doc.rect(35, currentY, 525, rowHeight).stroke(borderColor);

    const xLines = [72, 155, 210, 278, 340, 425];
    xLines.forEach((x) =>
      doc.moveTo(x, currentY).lineTo(x, currentY + rowHeight).stroke()
    );

    doc
      .fillColor(darkText)
      .fontSize(8)
      .text(index + 1, 48, currentY + 10)
      .text(item.application || "-", 80, currentY + 10)
      .text(item.requiredQuantity, 165, currentY + 10)
      .text(Number(item.pricePerMT).toFixed(2), 225, currentY + 10)
      .text(subtotal.toFixed(2), 286, currentY + 10)
      .text(gst.toFixed(2), 350, currentY + 10)
      .text(total.toFixed(2), 450, currentY + 10);

    currentY += rowHeight;
  });

  return currentY;
};