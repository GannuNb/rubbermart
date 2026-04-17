import { invoiceColors } from "../styles.js";

const { borderColor, darkText } = invoiceColors;

export const drawTotalsSection = (doc, order, currentY) => {
  const height = 80;

  doc.rect(35, currentY, 525, height).stroke(borderColor);

  const xLines = [72, 155, 210, 278, 340, 425];
  xLines.forEach((x) =>
    doc.moveTo(x, currentY).lineTo(x, currentY + height).stroke()
  );

  if (order.gstType === "cgst_sgst") {
    doc
      .fontSize(7)
      .text("Taxable Value", 288, currentY + 24)
      .text(order.taxableAmount || 0, 288, currentY + 44)

      .text("CGST + SGST", 348, currentY + 24)
      .text(order.gstAmount || 0, 350, currentY + 44)

      .fontSize(9)
      .text("Grand Total", 432, currentY + 24)
      .text(order.totalAmount || 0, 432, currentY + 44);
  } else {
    doc
      .fontSize(7)
      .text("Taxable Value", 285, currentY + 28)
      .text(order.taxableAmount || 0, 285, currentY + 44)

      .text("IGST", 350, currentY + 28)
      .text(order.igstAmount || 0, 350, currentY + 44)

      .fontSize(10)
      .text("Grand Total", 445, currentY + 35)
      .text(order.totalAmount || 0, 445, currentY + 52);
  }

  return currentY + height;
};