// backend/utils/pdf/shipping/sections/footerSection.js

import { invoiceColors } from "../../styles.js";

const {
  gold,
  darkText,
  lightText,
  primaryPurple,
  lightPurple,
  darkPurple,
} = invoiceColors;

export const drawFooterSection = (doc, startY) => {
  let currentY = (typeof startY === "number" ? startY : 700) + 15;

  /* =========================
     TERMS TITLE
  ========================= */

  doc
    .fillColor(darkText)
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("Terms and Conditions :", 35, currentY);

  /* =========================
     LINE
  ========================= */

  currentY += 12;

  doc
    .moveTo(35, currentY)
    .lineTo(560, currentY)
    .lineWidth(0.5)
    .strokeColor(gold)
    .stroke();

  currentY += 10;

  /* =========================
     TERMS CONTENT
  ========================= */

  doc
    .fillColor(lightText)
    .font("Helvetica")
    .fontSize(7)
    .text(
      "1. The Seller shall not be liable to the Buyer for any loss or damage.",
      35,
      currentY
    )
    .text(
      "2. The Seller warrants the product for one (1) year from the date of shipment.",
      35,
      currentY + 12
    )
    .text(
      "3. The purchase order will be interpreted as acceptance of this offer.",
      35,
      currentY + 24
    );

  /* =========================
     BOTTOM GRADIENT BANNER
  ========================= */

  const bannerY = Math.max(currentY + 60, 785);

  const gradient = doc.linearGradient(35, bannerY, 560, bannerY);

  gradient.stop(0, darkPurple);
  gradient.stop(0.5, primaryPurple);
  gradient.stop(1, lightPurple);

  doc.roundedRect(35, bannerY, 525, 22, 11).fill(gradient);

  /* =========================
     FOOTER TEXT
  ========================= */

  doc
    .fillColor("#ffffff")
    .font("Helvetica-Oblique")
    .fontSize(7)
    .text(
      "This is a system-generated shipping invoice and does not require a physical signature.",
      35,
      bannerY + 7,
      {
        width: 525,
        align: "center",
      }
    );
};