import path from "path";
import fs from "fs";
import { invoiceColors } from "../../styles.js";

const { primaryPurple, lightPurple, darkPurple, darkText } = invoiceColors;

export const drawHeader = (
  doc,
  pageWidth,
  pageHeight,
  order,
  shipment
) => {
  const headerGradient = doc.linearGradient(0, 0, pageWidth, 0);
  headerGradient.stop(0, darkPurple);
  headerGradient.stop(0.5, lightPurple);
  headerGradient.stop(1, primaryPurple);

  /* =========================
     PURPLE TOP SLANT
  ========================= */

  doc
    .save()
    .moveTo(0, 0)
    .lineTo(pageWidth, 0)
    .lineTo(pageWidth, 55)
    .lineTo(0, 100)
    .closePath()
    .fill(headerGradient)
    .restore();

  /* =========================
     GOLD LINE SLANT
  ========================= */

  const goldGradient = doc.linearGradient(0, 85, pageWidth, 110);
  goldGradient.stop(0, "#d19d4f");
  goldGradient.stop(0.5, "#d3a85e");
  goldGradient.stop(1, "#e6a544");

  doc
    .save()
    .moveTo(0, 92)
    .lineTo(pageWidth, 45)
    .lineTo(pageWidth, 55)
    .lineTo(0, 102)
    .closePath()
    .fill(goldGradient)
    .restore();

  /* =========================
     WHITE BASE
  ========================= */

  doc
    .save()
    .moveTo(0, 102)
    .lineTo(pageWidth, 70)
    .lineTo(pageWidth, pageHeight)
    .lineTo(0, pageHeight)
    .closePath()
    .fill("#ffffff")
    .restore();

  /* =========================
     LOGO
  ========================= */

  const logoPath = path.join( 
    process.cwd(),
    "../rubberproject/public/invoice_logo.png"
  );

  const fallbackLogoPath = path.join(
    process.cwd(),
    "rubberproject/public/invoice_logo.png"
  );

  const finalLogo = fs.existsSync(logoPath)
    ? logoPath
    : fs.existsSync(fallbackLogoPath)
    ? fallbackLogoPath
    : null;

  if (finalLogo) {
    doc.image(finalLogo, 5, 0, {
      fit: [170, 100],
      align: "center",
      valign: "center",
    });
  }

  /* =========================
     TITLE (CHANGED)
  ========================= */

  doc
    .fillColor("#ffffff")
    .font("Helvetica-Bold")
    .fontSize(20)
    .text("TAX INVOICE", 240, 20);

  /* =========================
     COMPANY DETAILS
  ========================= */

  doc
    .fillColor(darkText)
    .font("Helvetica-Bold")
    .fontSize(12)
    .text("Rubber Scrap Mart", 40, 110);

  doc
    .font("Helvetica")
    .fontSize(7)
    .text(
        "Office No. 217 ,\n" +
        "Skylark Premises Co-operative Society Ltd, \n" +
        "Plot No. 63, Sector 11, CBD Belapur,\n" +
        "Navi Mumbai – 400614, \n" +
        "GSTIN : 27AAVFV4635R1ZY",
      40,
      130,
      {
        width: 280,
        lineGap: 2,
      }
    );

  /* =========================
   RIGHT SIDE (UPDATED)
========================= */

const labelX = 415;
const colonX = 480;
const valueX = 495;

const row1Y = 115;
const row2Y = 135;
const row3Y = 155;

doc
  .fillColor(darkText)
  .font("Helvetica-Bold")
  .fontSize(9);

// Labels
doc.text("Order ID", labelX, row1Y);
doc.text("Invoice ID", labelX, row2Y);
doc.text("Ship Date", labelX, row3Y);

// Colons
doc.text(":", colonX, row1Y);
doc.text(":", colonX, row2Y);
doc.text(":", colonX, row3Y);

// Values
doc
  .font("Helvetica")
  .text(order?.orderId || "-", valueX, row1Y)
  .text(shipment?.shipmentInvoiceId || "-", valueX, row2Y)
  .text(
    shipment?.shippedAt
      ? new Date(shipment.shippedAt).toLocaleDateString("en-IN")
      : "-",
    valueX,
    row3Y
  );  

  return 190;
};