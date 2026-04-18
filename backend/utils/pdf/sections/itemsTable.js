import { invoiceColors } from "../styles.js";
const { primaryPurple, borderColor, darkText } = invoiceColors;

export const drawItemsTable = (doc, order, startY) => {
  let currentY = startY;
  const startX = 35;
  const tableWidth = 525;
  const headerHeight = 22;

  // Column X-positions (to be used for both text and vertical lines)
  const colX = {
    sno: 35,
    item: 72,
    qty: 155,
    price: 210,
    subtotal: 278,
    tax: 340,
    total: 425,
    end: 560
  };

  // 1. Draw Table Header
  doc.rect(startX, currentY, tableWidth, headerHeight).fill(primaryPurple);
  doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(8);
  
  doc.text("S.NO", colX.sno + 7, currentY + 7);
  doc.text("Item Name", colX.item + 10, currentY + 7);
  doc.text("Req Qty/MT", colX.qty + 5, currentY + 7, { width: 50, align: "center" });
  doc.text("Price/MT", colX.price + 5, currentY + 7, { width: 60, align: "center" });
  doc.text("Subtotal", colX.subtotal + 5, currentY + 7, { width: 60, align: "center" });
  
  const taxLabel = order.gstType === "cgst_sgst" ? "CGST + SGST" : "IGST (18%)";
  doc.text(taxLabel, colX.tax, currentY + 7, { width: 85, align: "center" });
  doc.text("Total Amount", colX.total + 10, currentY + 7);

  currentY += headerHeight;

  // 2. Draw Data Rows
  order.orderItems.forEach((item, index) => {
    const tax = Number(item.gstAmount || 0) > 0 ? Number(item.gstAmount) : Number(item.subtotal || 0) * 0.18;
    const total = Number(item.subtotal || 0) + tax;
    const itemName = item.application || item.name || "-";

    // --- DYNAMIC HEIGHT CALCULATION ---
    doc.font("Helvetica").fontSize(8);
    const itemNameHeight = doc.heightOfString(itemName, { width: colX.qty - colX.item - 15 });
    const dynamicRowHeight = Math.max(itemNameHeight + 15, 30); // Minimum 30px height

    // Draw Row Border and Vertical Lines
    doc.lineWidth(0.5).strokeColor(borderColor);
    doc.rect(startX, currentY, tableWidth, dynamicRowHeight).stroke();
    
    // Internal Vertical Separators
    Object.values(colX).slice(1, -1).forEach(x => {
      doc.moveTo(x, currentY).lineTo(x, currentY + dynamicRowHeight).stroke();
    });

    // Row Data Text
    doc.fillColor(darkText);
    doc.text(index + 1, colX.sno + 12, currentY + 10);
    doc.text(itemName, colX.item + 8, currentY + 10, { width: colX.qty - colX.item - 15 });
    doc.text(item.requiredQuantity, colX.qty, currentY + 10, { width: colX.price - colX.qty, align: "center" });
    doc.text(Number(item.pricePerMT || 0).toFixed(2), colX.price, currentY + 10, { width: colX.subtotal - colX.price, align: "center" });
    doc.text(Number(item.subtotal || 0).toFixed(2), colX.subtotal, currentY + 10, { width: colX.tax - colX.subtotal, align: "center" });
    doc.text(tax.toFixed(2), colX.tax, currentY + 10, { width: colX.total - colX.tax, align: "center" });
    doc.text(total.toFixed(2), colX.total + 10, currentY + 10);

    currentY += dynamicRowHeight;
  });

  return currentY; // Important: Returns the new Y for the Totals section
};