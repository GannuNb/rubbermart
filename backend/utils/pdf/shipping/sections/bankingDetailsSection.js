// backend/utils/pdf/shipping/sections/bankingDetailsSection.js

import { invoiceColors } from "../../styles.js";

const { darkText, borderColor } = invoiceColors;

export const drawBankingDetailsSection = (doc, startY) => {
  let currentY = (typeof startY === "number" ? startY : 600) + 15;

  const startX = 40;
  const endX = 560;

  /* =========================
     TITLE
  ========================= */

  doc
    .fillColor(darkText)
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("Banking Details", startX, currentY);

  /* =========================
     LINE
  ========================= */

  currentY += 12;

  doc
    .moveTo(startX, currentY)
    .lineTo(endX, currentY)
    .strokeColor(borderColor || "#999")
    .lineWidth(0.6)
    .stroke();

  currentY += 10;

  /* =========================
     HEADERS
  ========================= */

  const colX = {
    bank: 40,
    name: 130,
    acc: 240,
    ifsc: 350,
    type: 440,
    branch: 520,
  };

  doc
    .font("Helvetica-Bold")
    .fontSize(7)
    .fillColor(darkText);

  doc.text("Bank Name", colX.bank, currentY);
  doc.text("Account Name", colX.name, currentY);
  doc.text("Account Number", colX.acc, currentY);
  doc.text("IFSC Code", colX.ifsc, currentY);
  doc.text("Account Type", colX.type, currentY);
  doc.text("Branch", colX.branch, currentY);

  /* =========================
     VALUES
  ========================= */

  currentY += 14;

  doc
    .font("Helvetica")
    .fontSize(7);

  doc.text("IDFC FIRST BANK", colX.bank, currentY);
  doc.text("VIKAH RUBBERS", colX.name, currentY);
  doc.text("10113716761", colX.acc, currentY);
  doc.text("IDFB0040132", colX.ifsc, currentY);
  doc.text("CURRENT A/C", colX.type, currentY);
  doc.text("NERUL BRANCH", colX.branch, currentY);

  return currentY + 20;
};