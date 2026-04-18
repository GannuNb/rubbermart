import { invoiceColors } from "../styles.js";

const { gold, darkText, lightText, primaryPurple, lightPurple, darkPurple } = invoiceColors;

export const drawFooterSection = (doc, currentY) => {
  // Use the passed currentY to start the Terms section
  const termsY = currentY + 10; 

  doc.fillColor(darkText).font("Helvetica-Bold").fontSize(10).text("Terms and Conditions :", 35, termsY);

  doc
    .moveTo(35, termsY + 15)
    .lineTo(560, termsY + 15)
    .lineWidth(0.5)
    .strokeColor(gold)
    .stroke();

  doc
    .fillColor(lightText)
    .font("Helvetica") // Removed Oblique for better readability in terms
    .fontSize(7)
    .text("1. The Seller shall not be liable to the Buyer for any loss or damage.", 35, termsY + 25)
    .text("2. The Seller warrants the product for one (1) year from the date of shipment.", 35, termsY + 37)
    .text("3. The purchase order will be interpreted as acceptance of this offer.", 35, termsY + 49);

  // DYNAMIC BANNER POSITION
  // Instead of hardcoded 772, we place it after the terms OR at the bottom
  // We use Math.max to ensure it doesn't float in the middle if the page is empty
  const bannerY = Math.max(termsY + 70, 785); 

  const bottomGradient = doc.linearGradient(35, bannerY, 560, bannerY);
  bottomGradient.stop(0, darkPurple);
  bottomGradient.stop(0.5, primaryPurple);
  bottomGradient.stop(1, lightPurple);

  doc.roundedRect(35, bannerY, 525, 22, 11).fill(bottomGradient);

  doc
    .fillColor("#ffffff")
    .font("Helvetica-Oblique")
    .fontSize(7)
    .text(
      "This is a system-generated proforma invoice and does not require a physical signature.",
      35,
      bannerY + 7,
      { width: 525, align: "center" }
    );
};