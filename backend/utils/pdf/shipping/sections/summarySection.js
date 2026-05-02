// backend/utils/pdf/shipping/sections/summarySection.js

import { numberToWordsIndian } from "../../../mathHelpers.js";

export const drawSummarySection = (doc, totalAmount, startY) => {
  const summaryTop = startY + 10;

  /* =========================
     SAFE VALUE
  ========================= */

  const safeTotal = Number(totalAmount || 0);

  /* =========================
     BACKGROUND
  ========================= */

  doc
    .rect(35, summaryTop, 525, 45)
    .fill("#6859c9");

  /* =========================
     WORD CONVERSION
  ========================= */

  const words =
    numberToWordsIndian(Math.round(safeTotal)) || "Zero";

  /* =========================
     TEXT
  ========================= */

  doc
    .fillColor("#ffffff")
    .font("Helvetica-Bold")
    .fontSize(9)
    .text(
      `Total Amount In words : ${words}`,
      55,
      summaryTop + 15,
      {
        width: 460,
      }
    );

  return summaryTop + 55;
};