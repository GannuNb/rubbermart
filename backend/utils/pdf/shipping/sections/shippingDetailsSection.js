export const drawShippingDetailsSection = (doc, shipment, startY) => {
  let currentY = startY;

  const startX = 35;
  const boxWidth = 525;
  const padding = 10;

  /* =========================
     OUTER BOX
  ========================= */

  doc
    .rect(startX, currentY, boxWidth, 90)
    .stroke();

  /* =========================
     TITLE
  ========================= */

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("Shipping Details", startX + padding, currentY + 8);

  currentY += 28;

  doc.font("Helvetica").fontSize(8);

  /* =========================
     LEFT COLUMN
  ========================= */

  const leftX = startX + padding;
  const rightX = startX + 280;

  let leftY = currentY;
  let rightY = currentY;

  // Ship From
  doc.text("Ship From:", leftX, leftY);
  doc.text(
    shipment?.loadingLocation || "-",
    leftX + 80,
    leftY,
    { width: 180 }
  );

  leftY += 16;

  // Vehicle Number
  doc.text("Vehicle No:", leftX, leftY);
  doc.text(
    shipment?.vehicleNumber || "-",
    leftX + 80,
    leftY
  );

  leftY += 16;

  // Driver Name
  doc.text("Driver Name:", leftX, leftY);
  doc.text(
    shipment?.driverName || "-",
    leftX + 80,
    leftY
  );

  /* =========================
     RIGHT COLUMN
  ========================= */

  // Driver Phone
  doc.text("Driver Phone:", rightX, rightY);
  doc.text(
    shipment?.driverPhone || "-",
    rightX + 90,
    rightY
  );

  rightY += 16;

  // Shipment Status
  doc.text("Status:", rightX, rightY);
  doc.text(
    shipment?.status || "-",
    rightX + 90,
    rightY
  );

  rightY += 16;

  // Shipment ID
  doc.text("Shipment ID:", rightX, rightY);
  doc.text(
    shipment?._id || "-",
    rightX + 90,
    rightY,
    { width: 120 }
  );

  return startY + 100;
};