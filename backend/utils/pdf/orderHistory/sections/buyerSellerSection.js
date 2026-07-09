import { invoiceColors } from "../../styles.js";

const {
  primaryPurple,
  borderColor,
  darkText,
  lightText,
} = invoiceColors;

export const drawBuyerSellerSection = (doc, order, startY) => {
  let y = startY;

  /* =========================
      SECTION TITLE
  ========================= */

  doc
    .roundedRect(35, y, 525, 24, 4)
    .fill(primaryPurple);

  doc
    .fillColor("#ffffff")
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("BUYER & SELLER INFORMATION", 48, y + 7);

  y += 35;

  /* =========================
      CARDS
  ========================= */

  const cardWidth = 250;
  const cardHeight = 125;

  const buyerX = 35;
  const sellerX = 310;

  doc
    .roundedRect(buyerX, y, cardWidth, cardHeight, 5)
    .lineWidth(0.7)
    .strokeColor(borderColor)
    .stroke();

  doc
    .roundedRect(sellerX, y, cardWidth, cardHeight, 5)
    .lineWidth(0.7)
    .strokeColor(borderColor)
    .stroke();

  /* =========================
      CARD TITLES
  ========================= */

  doc
    .fillColor(primaryPurple)
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("BUYER DETAILS", buyerX + 12, y + 12);

  doc
    .fillColor(primaryPurple)
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("SELLER DETAILS", sellerX + 12, y + 12);

  const drawField = (label, value, x, currentY) => {
    doc
      .fillColor(lightText)
      .font("Helvetica-Bold")
      .fontSize(8)
      .text(label, x, currentY);

    doc
      .fillColor(darkText)
      .font("Helvetica")
      .fontSize(8)
      .text(value || "-", x + 78, currentY, {
        width: 150,
      });
  };

  const buyer = order?.buyer || {};
  const seller = order?.seller || {};

  const buyerBusiness = buyer?.businessProfile || {};
  const sellerBusiness = seller?.businessProfile || {};

  /* =========================
      BUYER
  ========================= */

  let leftY = y + 35;

  drawField("Company", buyerBusiness.companyName, buyerX + 12, leftY);
  leftY += 18;

  drawField("Contact", buyer.fullName, buyerX + 12, leftY);
  leftY += 18;

  drawField("Email", buyer.email, buyerX + 12, leftY);
  leftY += 18;

  drawField(
    "Phone",
    buyerBusiness.phoneNumber,
    buyerX + 12,
    leftY
  );
  leftY += 18;

  drawField("GST", buyerBusiness.gstNumber, buyerX + 12, leftY);

  /* =========================
      SELLER
  ========================= */

  let rightY = y + 35;

  drawField("Company", sellerBusiness.companyName, sellerX + 12, rightY);
  rightY += 18;

  drawField("Contact", seller.fullName, sellerX + 12, rightY);
  rightY += 18;

  drawField("Email", seller.email, sellerX + 12, rightY);
  rightY += 18;

  drawField(
    "Phone",
    sellerBusiness.phoneNumber,
    sellerX + 12,
    rightY
  );
  rightY += 18;

  drawField("GST", sellerBusiness.gstNumber, sellerX + 12, rightY);

  return y + cardHeight + 20;
};