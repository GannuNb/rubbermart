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
    tax: 420,
    total: 490,
  };

  /* =========================
     PRODUCT HEADER
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

  doc.text("Taxable", colX.subtotal, currentY + 7, {
    width: 60,
    align: "center",
  });

  const productGSTLabel =
    order?.gstType === "cgst_sgst" ? "CGST + SGST" : "IGST (18%)";

  doc.text(productGSTLabel, colX.tax, currentY + 7, {
    width: 60,
    align: "center",
  });

  doc.text("Total", colX.total, currentY + 7, {
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
      i?.productName === shipment?.selectedItem,
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
     PRODUCT CALCULATIONS
  ========================= */

  const orderedQty = Number(item.requiredQuantity || 0);

  const shippedQty = Number(shipment?.shippedQuantity || 0);

  const price = Number(item.pricePerMT || 0);

  const subtotal = shippedQty * price;

  let productIGST = 0;

  let productCGST = 0;

  let productSGST = 0;

  if (order?.gstType === "igst") {
    productIGST = subtotal * 0.18;
  } else {
    productCGST = subtotal * 0.09;

    productSGST = subtotal * 0.09;
  }

  const productGSTTotal = productIGST + productCGST + productSGST;

  const productTotal = subtotal + productGSTTotal;

  /* =========================
     TRANSPORT CALCULATIONS
  ========================= */

  const transportBase = Number(shipment?.transportPrice || 0);

  const transportGSTType = shipment?.transportGSTType || "igst";

  let transportIGST = 0;

  let transportCGST = 0;

  let transportSGST = 0;

  if (transportGSTType === "igst") {
    transportIGST = Number(shipment?.transportGSTAmount || 0);
  } else {
    transportCGST = Number(shipment?.transportGSTAmount || 0) / 2;

    transportSGST = Number(shipment?.transportGSTAmount || 0) / 2;
  }

  const transportGSTTotal = transportIGST + transportCGST + transportSGST;

  const transportTotal = Number(shipment?.transportFinalAmount || 0);

  /* =========================
     FINAL TOTAL
  ========================= */

  const grandTotal = productTotal + transportTotal;

  /* =========================
     PRODUCT ROW HEIGHT
  ========================= */

  doc.font("Helvetica").fontSize(8);

  const itemHeight = doc.heightOfString(item.application || "-", {
    width: colX.ordered - colX.item,
  });

  const rowHeight = Math.max(itemHeight + 12, 28);

  /* =========================
     DRAW PRODUCT ROW
  ========================= */

  doc.lineWidth(0.5).strokeColor(borderColor);

  doc.rect(startX, currentY, tableWidth, rowHeight).stroke();

  Object.values(colX)
    .slice(1)
    .forEach((x) => {
      doc
        .moveTo(x, currentY)
        .lineTo(x, currentY + rowHeight)
        .stroke();
    });

  doc.fillColor(darkText);

  doc.text("1", colX.sno + 10, currentY + 8);

  doc.text(item.application || "-", colX.item + 5, currentY + 8, {
    width: colX.ordered - colX.item - 5,
  });

  doc.text(orderedQty.toString(), colX.ordered, currentY + 8, {
    width: colX.shipped - colX.ordered,
    align: "center",
  });

  doc.text(shippedQty.toString(), colX.shipped, currentY + 8, {
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

  doc.text(productGSTTotal.toFixed(2), colX.tax, currentY + 8, {
    width: colX.total - colX.tax,
    align: "center",
  });

  doc.text(productTotal.toFixed(2), colX.total, currentY + 8, {
    width: 70,
    align: "center",
  });

  currentY += rowHeight;

  /* =========================
     PRODUCT SUMMARY ROW
  ========================= */

  const totalsHeight = 55;

  doc.rect(startX, currentY, tableWidth, totalsHeight).stroke();

  Object.values(colX)
    .slice(1)
    .forEach((x) => {
      doc
        .moveTo(x, currentY)
        .lineTo(x, currentY + totalsHeight)
        .stroke();
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

  doc.text(productGSTLabel, colX.tax, currentY + 12, {
    width: 60,
    align: "center",
  });

  doc.text(productGSTTotal.toFixed(2), colX.tax, currentY + 30, {
    width: 60,
    align: "center",
  });

  doc.text("Total", colX.total, currentY + 12, {
    width: 70,
    align: "center",
  });

  doc.text(productTotal.toFixed(2), colX.total, currentY + 30, {
    width: 70,
    align: "center",
  });

  /* =========================
     SMALL GAP
  ========================= */

  currentY += totalsHeight + 8;

  /* =========================
     TRANSPORT HEADER
  ========================= */

  const transportHeaderHeight = 22;

  const transportRowHeight = 34;

  doc
    .rect(startX, currentY, tableWidth, transportHeaderHeight)
    .fill(primaryPurple);

  doc.fillColor("#fff").font("Helvetica-Bold").fontSize(8);

  doc.text("Description", startX + 10, currentY + 7);

  doc.text("Transporter", startX + 155, currentY + 7);

  doc.text("HSN", startX + 280, currentY + 7);

  doc.text("Taxable", startX + 345, currentY + 7);

  doc.text(
    transportGSTType === "cgst_sgst" ? "CGST + SGST" : "IGST",
    startX + 415,
    currentY + 7,
  );

  doc.text("Total", startX + 490, currentY + 7);

  currentY += transportHeaderHeight;

  /* =========================
     TRANSPORT VALUES
  ========================= */

  const transporterName =
    shipment?.assignedTransporter?.businessProfile?.companyName ||
    shipment?.assignedTransporter?.fullName ||
    "Transport Service";

  const transportGSTLabel =
    transportGSTType === "cgst_sgst" ? "CGST+SGST" : "IGST";

  /* =========================
     DRAW TRANSPORT ROW
  ========================= */
  /* =========================
   TRANSPORT TABLE BORDER
========================= */

  doc.lineWidth(0.5).strokeColor(borderColor);

  doc.rect(startX, currentY, tableWidth, transportRowHeight).stroke();

  const transportCols = [
    startX + 145,
    startX + 275,
    startX + 330,
    startX + 400,
    startX + 475,
  ];

  transportCols.forEach((x) => {
    doc
      .moveTo(x, currentY)
      .lineTo(x, currentY + transportRowHeight)
      .stroke();
  });
  doc.fillColor(darkText).font("Helvetica").fontSize(8);

  doc.text("Transportation Charges", startX + 10, currentY + 10, {
    width: 120,
  });

  doc.text(transporterName, startX + 155, currentY + 10, {
    width: 110,
  });

  doc.text(shipment?.transportHSNCode || "9965", startX + 285, currentY + 10);

  doc.text(transportBase.toFixed(2), startX + 330, currentY + 10, {
    width: 70,
    align: "center",
  });

  doc.text(transportGSTTotal.toFixed(2), startX + 400, currentY + 10, {
    width: 55,
    align: "center",
  });

  doc.text(transportTotal.toFixed(2), startX + 470, currentY + 10, {
    width: 45,
    align: "center",
  });
  currentY += transportRowHeight + 18;

    /*    =========================
          GRAND TOTAL SUMMARY
          ========================= */
    /*    =========================
            INVOICE SUMMARY TABLE
          ========================= */

  const totalGST = productGSTTotal + transportGSTTotal;

  const summaryY = currentY;

  const summaryHeight = 32;

  /* =========================
      SUMMARY TABLE
    ========================= */

  doc.lineWidth(0.5).strokeColor(borderColor);

  doc
    .rect(startX, summaryY, tableWidth, summaryHeight)
    .fillAndStroke(primaryPurple, borderColor);

  /* =========================
      SUMMARY COLUMNS
    ========================= */

  const summaryCols = [startX + 130, startX + 265, startX + 395];

  summaryCols.forEach((x) => {
    doc
      .moveTo(x, summaryY)
      .lineTo(x, summaryY + summaryHeight)
      .stroke();
  });

  /* =========================
      SUMMARY TEXT
    ========================= */

  doc.fillColor("#fff");

  doc.font("Helvetica-Bold").fontSize(8);

  doc.text("INVOICE SUMMARY", startX + 10, summaryY + 7);

  doc.fontSize(7);

  doc.text("TOTAL TAXABLE", startX + 145, summaryY + 5, {
    width: 100,
    align: "center",
  });

  doc.text(
    `${(subtotal + transportBase).toFixed(2)}`,
    startX + 145,
    summaryY + 17,
    {
      width: 100,
      align: "center",
    },
  );

  doc.text("TOTAL GST", startX + 275, summaryY + 5, {
    width: 90,
    align: "center",
  });

  doc.text(`${totalGST.toFixed(2)}`, startX + 275, summaryY + 17, {
    width: 90,
    align: "center",
  });

  doc.text("GRAND TOTAL", startX + 405, summaryY + 5, {
    width: 90,
    align: "center",
  });

  doc.text(`${grandTotal.toFixed(2)}`, startX + 405, summaryY + 17, {
    width: 90,
    align: "center",
  });

  currentY += 45;

  return {
    y: currentY + 10,
    subtotal,
    gst: productGSTTotal,
    total: grandTotal,
  };
};
