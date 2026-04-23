import path from "path";
import fs from "fs";
import { invoiceColors } from "../styles.js";

const { primaryPurple, lightPurple, darkPurple, darkText } = invoiceColors;

export const drawHeader = (doc, pageWidth, pageHeight, order) => {
  const headerGradient = doc.linearGradient(0, 0, pageWidth, 0);
  headerGradient.stop(0, darkPurple);
  headerGradient.stop(0.5, lightPurple);
  headerGradient.stop(1, primaryPurple);

  // Purple Slant
  doc.save().moveTo(0, 0).lineTo(pageWidth, 0).lineTo(pageWidth, 55).lineTo(0, 100).closePath().fill(headerGradient).restore();

  // Gold Slant
  const goldGradient = doc.linearGradient(0, 85, pageWidth, 110);
  goldGradient.stop(0, "#b8863b");
  goldGradient.stop(0.5, "#d2a85d");
  goldGradient.stop(1, "#b8863b");

  doc.save().moveTo(0, 92).lineTo(pageWidth, 45).lineTo(pageWidth, 55).lineTo(0, 102).closePath().fill(goldGradient).restore();

  // White Base
  doc.save().moveTo(0, 102).lineTo(pageWidth, 70).lineTo(pageWidth, pageHeight).lineTo(0, pageHeight).closePath().fill("#ffffff").restore();

  // Logo
  const logoPath = path.join(process.cwd(), "../rubberproject/public/rsm_logo.png");
  const fallbackLogoPath = path.join(process.cwd(), "rubberproject/public/rsm_logo.png");
  const finalLogo = fs.existsSync(logoPath) ? logoPath : fs.existsSync(fallbackLogoPath) ? fallbackLogoPath : null;

  if (finalLogo) doc.image(finalLogo, 18, 10, { width: 72, height: 72 });

  doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(18).text("PROFORMA INVOICE", 255, 18);

  doc.fillColor(darkText).font("Helvetica-Bold").fontSize(10).text("Rubber Scrap Mart", 40, 108);
  doc.fillColor(darkText).font("Helvetica").fontSize(8).text(
    "Ground Floor, Office No-52/ Plot No-144,\nSai Chamber, CHS Wing A, Sector -11,\nSai Chambers, CBD Belapur, Navi Mumbai,\nThane, Maharashtra, 400614, GSTIN\n27AAVFV4635R1ZY",
    40, 123, { width: 240, lineGap: 2 }
  );

  doc.fontSize(9).text(`Order ID   : ${order.orderId || "-"}`, 455, 118)
    .text(`Order Date : ${new Date(order.createdAt).toLocaleDateString("en-IN")}`, 455, 138);

    return 180;
};