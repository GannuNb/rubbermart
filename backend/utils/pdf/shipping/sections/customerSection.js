export const drawCustomerSection = (doc, order, shipment, startY) => {
  let currentY = startY;

  /* =========================
     POSITIONS (BALANCED)
  ========================= */

  const detailsX = 35;
  const billX = 105;
  const shipX = 255;
  const shippingBoxX = 410;

  const headerHeight = 25;

  const detailsWidth = 70;
  const billWidth = 140;
  const shipWidth = 140;
  const shippingWidth = 150;

  /* =========================
     HEADER ROW
  ========================= */

  doc.rect(detailsX, currentY, detailsWidth, headerHeight).fill("#eae7ff");
  doc.rect(billX, currentY, billWidth, headerHeight).fill("#6859c9");
  doc.rect(shipX, currentY, shipWidth, headerHeight).fill("#6859c9");
  doc.rect(shippingBoxX, currentY, shippingWidth, headerHeight).fill("#6859c9");

  doc.fillColor("#000").font("Helvetica-Bold").fontSize(9);
  doc.text("Details", detailsX, currentY + 8, { width: detailsWidth, align: "center" });

  doc.fillColor("#fff");
  doc.text("Bill To", billX, currentY + 8, { width: billWidth, align: "center" });
  doc.text("Ship To", shipX, currentY + 8, { width: shipWidth, align: "center" });
  doc.text("Shipping Details", shippingBoxX, currentY + 8, {
    width: shippingWidth,
    align: "center",
  });

  currentY += 35;

  /* =========================
     RESET COLOR
  ========================= */

  doc.fillColor("#000");

  /* =========================
     DATA
  ========================= */

  const labels = ["Name", "Company", "Address", "Phone", "E-mail", "GSTN"];

  const billData = [
    order?.buyer?.fullName || "-",
    order?.buyer?.businessProfile?.companyName || "-",
    order?.buyer?.businessProfile?.billingAddress || "-",
    order?.buyer?.businessProfile?.phoneNumber || "-",
    order?.buyer?.email || "-",
    order?.buyer?.businessProfile?.gstNumber || "-",
  ];

  const shipAddress =
    order?.shippingAddress?.fullAddress ||
    [
      order?.shippingAddress?.flatHouse,
      order?.shippingAddress?.areaStreet,
      order?.shippingAddress?.city,
      order?.shippingAddress?.state,
      order?.shippingAddress?.pincode,
    ].filter(Boolean).join(", ") || "-";

  const shipData = [
    order?.shippingAddress?.fullName || "-",
    order?.buyer?.businessProfile?.companyName || "-",
    shipAddress,
    order?.shippingAddress?.mobileNumber || "-",
    order?.buyer?.email || "-",
    order?.buyer?.businessProfile?.gstNumber || "-",
  ];

  const shippingLabels = [
    "Ship From",
    "Vehicle Number",
    "Driver Name",
    "Driver Contact",
  ];

  const shippingData = [
    shipment?.shipmentFrom || "-",
    shipment?.vehicleNumber || "-",
    shipment?.driverName || "-",
    shipment?.driverMobile || "-",
  ];

  /* =========================
     LEFT TABLE (SAFE HEIGHT)
  ========================= */

  labels.forEach((label, i) => {
    doc.font("Helvetica").fontSize(8);

    const billHeight = doc.heightOfString(billData[i], {
      width: billWidth - 10,
    });

    const shipHeight = doc.heightOfString(shipData[i], {
      width: shipWidth - 10,
    });

    const rowHeight = Math.max(billHeight, shipHeight, 12) + 4;

    // Details
    doc.font("Helvetica-Bold");
    doc.text(label, detailsX + 3, currentY);
    doc.text(":", detailsX + detailsWidth - 10, currentY);

    // Bill
    doc.font("Helvetica");
    doc.text(billData[i], billX + 5, currentY, {
      width: billWidth - 10,
    });

    // Ship
    doc.text(shipData[i], shipX + 5, currentY, {
      width: shipWidth - 10,
    });

    currentY += rowHeight;
  });

  /* =========================
     SHIPPING DETAILS (DYNAMIC HEIGHT)
  ========================= */

  let sdY = startY + 35;

  shippingLabels.forEach((label, i) => {
    doc.font("Helvetica").fontSize(8);

    const value = shippingData[i];

    const valueHeight = doc.heightOfString(value, {
      width: shippingWidth - 70,
    });

    const rowHeight = Math.max(valueHeight, 12) + 4;

    // Label
    doc.font("Helvetica-Bold");
    doc.text(label, shippingBoxX + 5, sdY, {
      width: 65,
    });

    doc.text(":", shippingBoxX + 70, sdY);

    // Value (wrapped safely)
    doc.font("Helvetica");
    doc.text(value, shippingBoxX + 75, sdY, {
      width: shippingWidth - 80,
    });

    sdY += rowHeight;
  });

  return Math.max(currentY, sdY) + 10;
};