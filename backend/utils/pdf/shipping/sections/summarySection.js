// backend/utils/pdf/shipping/sections/summarySection.js

import { numberToWordsIndian } from "../../../mathHelpers.js";

export const drawSummarySection = (
  doc,
  totalAmount,
  startY,
) => {
  /* =========================
     POSITION
  ========================= */

  const summaryTop = startY;

  /* =========================
     SAFE TOTAL
  ========================= */

  const safeTotal = Number(
    totalAmount || 0,
  );

  /* =========================
     AMOUNT IN WORDS
  ========================= */

  const words =
    numberToWordsIndian(
      Math.round(safeTotal),
    ) || "Zero";

  /* =========================
     COMPACT SUMMARY BOX
  ========================= */

  doc
    .rect(35, summaryTop, 525, 28)
    .fill("#6859c9");

  /* =========================
     TEXT
  ========================= */

  doc
    .fillColor("#ffffff")
    .font("Helvetica-Bold")
    .fontSize(8);

  doc.text(
    `Amount In Words : ${words}`,
    45,
    summaryTop + 10,
    {
      width: 470,
    },
  );

  return summaryTop + 36;
};