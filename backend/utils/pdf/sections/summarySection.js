// backend/utils/pdf/sections/summarySection.js

import { invoiceColors } from "../styles.js";
import { numberToWordsIndian } from "../../mathHelpers.js";
import { RUPEE_SYMBOL } from "../rupee.js";
import { boldFont } from "../fonts.js";

const { primaryPurple, lightPurple, darkPurple } = invoiceColors;

export const drawSummarySection = (doc, order, currentY) => {
  const summaryTop = currentY + 5;

  const summaryGradient = doc.linearGradient(
    35,
    summaryTop,
    560,
    summaryTop
  );

  summaryGradient.stop(0, darkPurple);
  summaryGradient.stop(0.5, primaryPurple);
  summaryGradient.stop(1, lightPurple);

  // reduced height from 70 → 50
  doc.rect(35, summaryTop, 525, 50).fill(summaryGradient);

  const amountText =
    order.amountInWords ||
    numberToWordsIndian(
      Math.round(Number(order.totalAmount || 0))
    );

  doc
    .fillColor("#ffffff")
    .font(boldFont)
    .fontSize(9)
    .text(
      `Total Amount In Words (${RUPEE_SYMBOL}) : ${amountText}`,
      55,
      summaryTop + 18,
      {
        width: 460,
        align: "left",
      }
    );

  // reduced spacing
  return summaryTop + 58;
};