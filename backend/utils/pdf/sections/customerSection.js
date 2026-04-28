import { invoiceColors } from "../styles.js";

const { primaryPurple, darkText } = invoiceColors;

export const drawCustomerSection = (doc, order, startY) => {
  let currentY = startY;

  // column positions
  const detailsX = 35;
  const billToX = 140;
  const shipToX = 355;

  // widths
  const detailsWidth = 90;
  const billToWidth = 190;
  const shipToWidth = 190;

  const headerHeight = 25;

  /* =========================
     HEADERS ONLY
  ========================= */

  // Details Header
  doc
    .rect(detailsX, currentY, detailsWidth, headerHeight)
    .fill("#F2F2F7");

  // Bill To Header
  doc
    .rect(billToX, currentY, billToWidth, headerHeight)
    .fill(primaryPurple);

  // Ship To Header
  doc
    .rect(shipToX, currentY, shipToWidth, headerHeight)
    .fill(primaryPurple);

  // Header Text
  doc
    .fillColor(darkText)
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("Details", detailsX, currentY + 8, {
      width: detailsWidth,
      align: "center",
    });

  doc
    .fillColor("#ffffff")
    .text("Bill To", billToX, currentY + 8, {
      width: billToWidth,
      align: "center",
    });

  doc
    .text("Ship To", shipToX, currentY + 8, {
      width: shipToWidth,
      align: "center",
    });

  // reduced from 38 → 32
  currentY += 32;

  /* =========================
     DATA
  ========================= */

  const labels = [
    "Name",
    "Company",
    "Address",
    "Phone",
    "E-mail",
    "GSTN",
  ];

  const buyerData = [
    order.buyer?.fullName || "-",
    order.buyer?.businessProfile?.companyName || "-",
    order.buyer?.businessProfile?.billingAddress || "-",
    order.buyer?.businessProfile?.phoneNumber || "-",
    order.buyer?.businessProfile?.email || "-",
    order.buyer?.businessProfile?.gstNumber || "-",
  ];

  const shipToAddress =
    order.shippingAddress?.fullAddress ||
    [
      order.shippingAddress?.flatHouse,
      order.shippingAddress?.areaStreet,
      order.shippingAddress?.landmark,
      order.shippingAddress?.city,
      order.shippingAddress?.state,
      order.shippingAddress?.pincode,
    ]
      .filter(Boolean)
      .join(", ") ||
    order.buyer?.businessProfile?.shippingAddress ||
    order.buyer?.businessProfile?.billingAddress ||
    "-";

  const shipData = [
    order.shippingAddress?.fullName || "-",
    order.buyer?.businessProfile?.companyName || "-",
    shipToAddress,
    order.shippingAddress?.mobileNumber || "-",
    order.buyer?.email || "-",
    order.buyer?.businessProfile?.gstNumber || "-",
  ];

  /* =========================
     SIMPLE ALIGNED CONTENT
  ========================= */

  labels.forEach((label, i) => {
    const rowStartY = currentY;

    doc.font("Helvetica").fontSize(8);

    const billHeight = doc.heightOfString(buyerData[i], {
      width: billToWidth - 10,
    });

    const shipHeight = doc.heightOfString(shipData[i], {
      width: shipToWidth - 10,
    });

    // reduced spacing here
    const rowHeight = Math.max(billHeight, shipHeight, 14) + 4;

    // Details Column
    doc
      .fillColor(darkText)
      .font("Helvetica-Bold")
      .fontSize(8.5) // slightly smaller
      .text(label, detailsX + 5, rowStartY, {
        width: 60,
      });

    doc.text(":", detailsX + 68, rowStartY);

    // Bill To Column
    doc
      .font("Helvetica")
      .fontSize(7.5) // slightly smaller
      .text(buyerData[i], billToX, rowStartY, {
        width: billToWidth,
      });

    // Ship To Column
    doc.text(shipData[i], shipToX, rowStartY, {
      width: shipToWidth,
    });

    currentY += rowHeight;
  });

  // reduced from 15 → 8
  return currentY + 8;
};