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
    .fontSize(7)

    .text("Bank Name", 40, currentY)
    .text("Account Name", 125, currentY)
    .text("Account Number", 235, currentY)
    .text("IFSC Code", 360, currentY)
    .text("Account Type", 440, currentY);

  currentY += 16;

  /* =========================
     ALL VALUES IN ONE ROW
  ========================= */

  doc
    .font("Helvetica")
    .fontSize(7)

    .text("IDFC FIRST BANK", 40, currentY)
    .text("VIKAH RUBBERS", 125, currentY)
    .text("10113716761", 235, currentY)
    .text("IDFB0040132", 360, currentY)
    .text("CURRENT A/C", 440, currentY);

  currentY += 18;

  /* =========================
     BRANCH ROW
  ========================= */

  doc
    .font("Helvetica-Bold")
    .fontSize(7)
    .text("Branch", 40, currentY);

  doc
    .font("Helvetica")
    .fontSize(7)
    .text("NERUL BRANCH", 85, currentY);

  currentY += 15;

  return currentY + 5;
};