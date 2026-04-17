import { invoiceColors } from "../styles.js";

const { gold, darkText, lightText, primaryPurple, lightPurple, darkPurple } =
  invoiceColors;

export const drawFooterSection = (doc, currentY) => {
  const termsY = currentY + 95;

  doc.font("Helvetica-Bold").fontSize(10).text("Terms and Conditions :", 35, termsY);

  doc
    .moveTo(35, termsY + 18)
    .lineTo(560, termsY + 18)
    .strokeColor(gold)
    .stroke();

  doc
    .fillColor(lightText)
    .font("Helvetica-Oblique")
    .fontSize(7)
    .text("1. Seller not liable for loss or damage.", 35, termsY + 35)
    .text("2. Warranty 1 year from shipment.", 35, termsY + 55)
    .text("3. PO = acceptance of offer.", 35, termsY + 75);

  const bottomGradient = doc.linearGradient(35, 772, 560, 772);
  bottomGradient.stop(0, darkPurple);
  bottomGradient.stop(0.5, primaryPurple);
  bottomGradient.stop(1, lightPurple);

  doc.roundedRect(35, 772, 525, 22, 12).fill(bottomGradient);

  doc
    .fillColor("#fff")
    .font("Helvetica-Oblique")
    .fontSize(7)
    .text(
      "This is a system-generated invoice.",
      60,
      779,
      { width: 470, align: "center" }
    );
};