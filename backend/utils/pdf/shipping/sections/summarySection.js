import { numberToWordsIndian } from "../../../mathHelpers.js";

export const drawSummarySection = (doc, order, startY) => {
  const summaryTop = startY + 5;

  doc
    .rect(35, summaryTop, 525, 50)
    .fill("#6859c9");

  const amountText =
    order.amountInWords ||
    numberToWordsIndian(
      Math.round(Number(order.totalAmount || 0))
    );

  doc
    .fillColor("#ffffff")
    .font("Helvetica-Bold")
    .fontSize(9)
    .text(
      `Total Amount In words : ${amountText}`,
      55,
      summaryTop + 18,
      {
        width: 460,
      }
    );

  return summaryTop + 58;
};