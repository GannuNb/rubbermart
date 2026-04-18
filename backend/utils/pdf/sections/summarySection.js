import { invoiceColors } from "../styles.js";
import { numberToWordsIndian } from "../../mathHelpers.js"; // Going up two levels to reach utils/

const { primaryPurple, lightPurple, darkPurple } = invoiceColors;

export const drawSummarySection = (doc, order, currentY) => {
  const summaryTop = currentY + 5;

  const summaryGradient = doc.linearGradient(35, summaryTop, 560, summaryTop);
  summaryGradient.stop(0, darkPurple);
  summaryGradient.stop(0.5, primaryPurple);
  summaryGradient.stop(1, lightPurple);

  doc.rect(35, summaryTop, 525, 70).fill(summaryGradient);

  // Logic: Use order.amountInWords if it exists, 
  // otherwise generate it dynamically from totalAmount
  const amountText = order.amountInWords || numberToWordsIndian(Math.round(order.totalAmount || 0));

  doc
    .fillColor("#ffffff")
    .font("Helvetica-Bold")
    .fontSize(9)
    .text(
      `Total Amount In words : ${amountText}`,
      60,
      summaryTop + 28,
      {
        width: 430,
        align: 'left'
      }
    );

  return summaryTop + 80;
};