import { invoiceColors } from "../styles.js";
const { borderColor, darkText } = invoiceColors;

export const drawTotalsSection = (doc, order, currentY) => {
  const height = 70;
  const startX = 35;
  const tableWidth = 525;

  // Draw the border box starting at the dynamic Y
  doc.rect(startX, currentY, tableWidth, height).strokeColor(borderColor).stroke();

  // Vertical separators aligned with the Items Table columns
  [72, 155, 210, 278, 340, 425].forEach(x => {
    doc.moveTo(x, currentY).lineTo(x, currentY + height).stroke();
  });

  doc.fillColor(darkText).font("Helvetica-Bold");

  // Aligned centering for the totals
  if (order.gstType === "cgst_sgst") {
    doc.fontSize(7).text("Taxable Value", 282, currentY + 15, { width: 55, align: "center" })
       .text(Number(order.taxableAmount || 0).toFixed(2), 282, currentY + 35, { width: 55, align: "center" })
       .text("CGST + SGST", 345, currentY + 15, { width: 75, align: "center" })
       .text(Number(order.gstAmount || 0).toFixed(2), 345, currentY + 35, { width: 75, align: "center" })
       .fontSize(10).text("Grand Total", 432, currentY + 15, { width: 115, align: "center" })
       .text(Number(order.totalAmount || 0).toFixed(2), 432, currentY + 35, { width: 115, align: "center" });
  } else {
    // Similar centering for IGST...
    doc.fontSize(7).text("Taxable Value", 282, currentY + 15, { width: 55, align: "center" })
       .text(Number(order.taxableAmount || 0).toFixed(2), 282, currentY + 35, { width: 55, align: "center" })
       .text("IGST (18%)", 345, currentY + 15, { width: 75, align: "center" })
       .text(Number(order.igstAmount || 0).toFixed(2), 345, currentY + 35, { width: 75, align: "center" })
       .fontSize(10).text("Grand Total", 432, currentY + 15, { width: 115, align: "center" })
       .text(Number(order.totalAmount || 0).toFixed(2), 432, currentY + 35, { width: 115, align: "center" });
  }

  return currentY + height + 10; // Extra 10px padding before Summary
};