import path from "path";
import fs from "fs";

export const drawHeader = (
  doc,
  pageWidth,
  pageHeight,
  order,
  shipment
) => {
  /* =========================
     SIMPLE CLEAN HEADER
  ========================= */

  // Top border space
  let startY = 30;

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
    doc.image(finalLogo, 35, 25, {
      fit: [120, 60],
    });
  }

  /* =========================
     TITLE
  ========================= */

  doc
    .fillColor("#000")
    .font("Helvetica-Bold")
    .fontSize(16)
    .text("SHIPPING INVOICE", 380, 30, {
      align: "right",
      width: 160,
    });

  /* =========================
     RIGHT SIDE INFO
  ========================= */

  let infoY = 60;

  doc
    .fontSize(9)
    .font("Helvetica-Bold")
    .text("Invoice ID :", 380, infoY);

  doc
    .font("Helvetica")
    .text(
      shipment?.shipmentInvoiceId || "-",
      470,
      infoY
    );

  infoY += 18;

  doc
    .font("Helvetica-Bold")
    .text("Shipment Date :", 380, infoY);

  doc
    .font("Helvetica")
    .text(
      shipment?.shippedAt
        ? new Date(shipment.shippedAt).toLocaleDateString("en-IN")
        : "-",
      470,
      infoY
    );

  infoY += 18;

  doc
    .font("Helvetica-Bold")
    .text("Order ID :", 380, infoY);

  doc
    .font("Helvetica")
    .text(order?.orderId || "-", 470, infoY);

  /* =========================
     COMPANY DETAILS (LEFT)
  ========================= */

  let companyY = 95;

  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("Rubber Scrap Mart", 35, companyY);

  doc
    .font("Helvetica")
    .fontSize(7)
    .text(
      "Ground Floor, Office No-52/ Plot No-144,\n" +
        "Sai Chamber, CHS Wing A, Sector -11,\n" +
        "CBD Belapur, Navi Mumbai,\n" +
        "Maharashtra - 400614\n" +
        "GSTIN: 27AAVFV4635R1ZY",
      35,
      companyY + 15,
      {
        lineGap: 2,
      }
    );

  /* =========================
     RETURN Y POSITION
  ========================= */

  return 160;
};