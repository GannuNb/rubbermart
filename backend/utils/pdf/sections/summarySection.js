import { invoiceColors } from "../styles.js";

const { primaryPurple, lightPurple, darkPurple } = invoiceColors;

export const drawSummarySection = (doc, order, currentY) => {
  const summaryTop = currentY + 5;

  const gradient = doc.linearGradient(35, summaryTop, 560, summaryTop);
  gradient.stop(0, darkPurple);
  gradient.stop(0.5, primaryPurple);
  gradient.stop(1, lightPurple);

  doc.rect(35, summaryTop, 525, 70).fill(gradient);

  doc
    .fillColor("#fff")
    .font("Helvetica-Bold")
    .fontSize(9)
    .text(
      `Amount in words: ${order.amountInWords || "-"}`,
      60,
      summaryTop + 28,
      { width: 430 }
    );

  return summaryTop + 80;
};