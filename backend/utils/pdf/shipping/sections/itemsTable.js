// backend/utils/pdf/shipping/sections/itemsTable.js

import { invoiceColors } from "../../styles.js";
const { primaryPurple, borderColor, darkText } = invoiceColors;

export const drawItemsTable = (doc, order, shipment, startY) => {
  let currentY = startY;

  const startX = 35;
  const tableWidth = 525;
  const headerHeight = 22;

  /* =========================
     COLUMN POSITIONS
  ========================= */

  const colX = {
    sno: 35,
    item: 70,
    ordered: 170,
    shipped: 230,
    price: 290,
    subtotal: 350,
    tax: 410,
    total: 470,
  };

  /* =========================
     HEADER
  ========================= */

  doc.rect(startX, currentY, tableWidth, headerHeight).fill(primaryPurple);

  doc.fillColor("#fff").font("Helvetica-Bold").fontSize(8);

  doc.text("S.NO", colX.sno + 5, currentY + 7);
  doc.text("Item Name", colX.item + 5, currentY + 7);

  doc.text("Ordered Qty", colX.ordered, currentY + 7, {
    width: 50,
    align: "center",
  });

  doc.text("Shipped Qty", colX.shipped, currentY + 7, {
    width: 50,
    align: "center",
  });

  doc.text("Price/MT", colX.price, currentY + 7, {
    width: 60,
    align: "center",
  });

  doc.text("Subtotal", colX.subtotal, currentY + 7, {
    width: 60,
    align: "center",
  });

  const taxLabel =
    order.gstType === "cgst_sgst"
      ? "CGST + SGST"
      : "IGST (18%)";

  doc.text(taxLabel, colX.tax, currentY + 7, {
    width: 60,
    align: "center",
  });

  doc.text("Total Amount", colX.total, currentY + 7, {
    width: 70,
    align: "center",
  });

  currentY += headerHeight;

  /* =========================
     FIND ITEM
  ========================= */

  const item = order?.orderItems?.find(
    (i) =>
      i?.application === shipment?.selectedItem ||
      i?.productName === shipment?.selectedItem
  );

  if (!item) {
    doc.fillColor("red").text("No shipment item found", startX, currentY);
    return {
      y: currentY + 30,
      subtotal: 0,
      gst: 0,
      total: 0,
    };
  }

  /* =========================
     CALCULATIONS
  ========================= */

  const orderedQty = Number(item.requiredQuantity || 0);
  const shippedQty = Number(shipment?.shippedQuantity || 0);
  const price = Number(item.pricePerMT || 0);

  const subtotal = shippedQty * price;
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  /* =========================
     ROW HEIGHT
  ========================= */

  doc.font("Helvetica").fontSize(8);

  const itemHeight = doc.heightOfString(item.application || "-", {
    width: colX.ordered - colX.item,
  });

  const rowHeight = Math.max(itemHeight + 12, 28);

  /* =========================
     DRAW ROW
  ========================= */

  doc.lineWidth(0.5).strokeColor(borderColor);

  doc.rect(startX, currentY, tableWidth, rowHeight).stroke();

  Object.values(colX).slice(1).forEach((x) => {
    doc.moveTo(x, currentY).lineTo(x, currentY + rowHeight).stroke();
  });

  doc.fillColor(darkText);

  doc.text(1, colX.sno + 10, currentY + 8);

  doc.text(item.application || "-", colX.item + 5, currentY + 8, {
    width: colX.ordered - colX.item - 5,
  });

  doc.text(orderedQty, colX.ordered, currentY + 8, {
    width: colX.shipped - colX.ordered,
    align: "center",
  });

  doc.text(shippedQty, colX.shipped, currentY + 8, {
    width: colX.price - colX.shipped,
    align: "center",
  });

  doc.text(price.toFixed(2), colX.price, currentY + 8, {
    width: colX.subtotal - colX.price,
    align: "center",
  });

  doc.text(subtotal.toFixed(2), colX.subtotal, currentY + 8, {
    width: colX.tax - colX.subtotal,
    align: "center",
  });

  doc.text(gst.toFixed(2), colX.tax, currentY + 8, {
    width: colX.total - colX.tax,
    align: "center",
  });

  doc.text(total.toFixed(2), colX.total, currentY + 8, {
    width: 70,
    align: "center",
  });

  currentY += rowHeight;

  /* =========================
     TOTAL ROW
  ========================= */

  const totalsHeight = 55;

  doc.rect(startX, currentY, tableWidth, totalsHeight).stroke();

  Object.values(colX).slice(1).forEach((x) => {
    doc.moveTo(x, currentY).lineTo(x, currentY + totalsHeight).stroke();
  });

  doc.font("Helvetica-Bold").fillColor(darkText);

  doc.text("Taxable Value", colX.subtotal, currentY + 12, {
    width: 60,
    align: "center",
  });

  doc.text(subtotal.toFixed(2), colX.subtotal, currentY + 30, {
    width: 60,
    align: "center",
  });

  doc.text(taxLabel, colX.tax, currentY + 12, {
    width: 60,
    align: "center",
  });

  doc.text(gst.toFixed(2), colX.tax, currentY + 30, {
    width: 60,
    align: "center",
  });

  doc.text("Grand Total", colX.total, currentY + 12, {
    width: 70,
    align: "center",
  });

  doc.text(total.toFixed(2), colX.total, currentY + 30, {
    width: 70,
    align: "center",
  });

  currentY += totalsHeight;

  return {
    y: currentY + 10,
    subtotal,
    gst,
    total,
  };
};