// backend/utils/pdf/sections/bankingDetailsSection.js

import { invoiceColors } from "../styles.js";

const { darkText, borderColor } = invoiceColors;

export const drawBankingDetailsSection = (doc, startY) => {
  let currentY = startY + 10;

  /* =========================
     SIMPLE LEFT TITLE
  ========================= */

  doc
    .fillColor(darkText)
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("Banking Details", 40, currentY);

  /* =========================
     HORIZONTAL LINE BELOW TITLE
  ========================= */

  currentY += 15;

  doc
    .moveTo(40, currentY)
    .lineTo(560, currentY)
    .strokeColor(borderColor || "#444444")
    .lineWidth(0.8)
    .stroke();

  currentY += 12;

  /* =========================
     ALL HEADINGS IN ONE ROW
  ========================= */

  doc
  .fillColor(darkText)
  .font("Helvetica-Bold")
  .fontSize(6.5)

  .text("Bank Name", 40, currentY)
  .text("Account Name", 120, currentY)
  .text("Account Number", 220, currentY)
  .text("IFSC Code", 330, currentY)
  .text("Account Type", 410, currentY)
  .text("Branch", 500, currentY);

  currentY += 16;

  /* =========================
     ALL VALUES IN ONE ROW
  ========================= */

  currentY += 15;

doc
  .font("Helvetica")
  .fontSize(6.5)

  .text("IDFC FIRST BANK", 40, currentY)
  .text("VIKAH RUBBERS", 120, currentY)
  .text("10113716761", 220, currentY)
  .text("IDFB0040132", 330, currentY)
  .text("CURRENT A/C", 410, currentY)
  .text("NERUL BRANCH", 500, currentY);

currentY += 15;


  return currentY + 5;
};