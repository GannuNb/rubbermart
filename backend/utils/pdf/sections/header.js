import path from "path";
import fs from "fs";
import { invoiceColors } from "../styles.js";

const { primaryPurple, lightPurple, darkPurple, darkText } = invoiceColors;

export const drawHeader = (doc, pageWidth, pageHeight, order) => {
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
    "../rubberproject/public/rsm_logo.png"
  );

  const fallbackLogoPath = path.join(
    process.cwd(),
    "rubberproject/public/rsm_logo.png"
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
     TITLE
  ========================= */

  doc
    .fillColor("#ffffff")
    .font("Helvetica-Bold")
    .fontSize(20)
    .text("PROFORMA INVOICE", 240, 20);

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
      "Ground Floor, Office No-52/ Plot No-144,\n" +
        "Sai Chamber, CHS Wing A, Sector -11,\n" +
        "Sai Chambers, CBD Belapur, Navi Mumbai,\n" +
        "Thane, Maharashtra, 400614, GSTIN\n" +
        "27AAVFV4635R1ZY",
      40,
      130,
      {
        width: 280,
        lineGap: 2,
      }
    );

  /* =========================
     ORDER INFO (RIGHT SIDE)
     moved a little more left
  ========================= */

  const labelX = 430; // moved left from 455
  const colonX = 500; // moved left from 525
  const valueX = 510; // moved left from 535

  const row1Y = 125;
  const row2Y = 148;

  doc
    .fillColor(darkText)
    .font("Helvetica-Bold")
    .fontSize(10);

  // Labels
  doc.text("Order ID", labelX, row1Y);
  doc.text("Order Date", labelX, row2Y);

  // Colons aligned properly
  doc.text(":", colonX, row1Y);
  doc.text(":", colonX, row2Y);

  // Values
  doc
    .font("Helvetica")
    .text(`${order.orderId || "-"}`, valueX, row1Y)
    .text(
      `${new Date(order.createdAt).toLocaleDateString("en-IN")}`,
      valueX,
      row2Y
    );

  return 190;
};