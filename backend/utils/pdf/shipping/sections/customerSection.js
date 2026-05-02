export const drawCustomerSection = (doc, order, startY) => {
  let currentY = startY;

  const leftX = 35;
  const rightX = 300;

  const boxWidth = 240;
  const padding = 10;

  /* =========================
     BILL TO
  ========================= */

  doc
    .rect(leftX, currentY, boxWidth, 120)
    .stroke();

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("Bill To", leftX + padding, currentY + 8);

  let billY = currentY + 28;

  doc
    .font("Helvetica")
    .fontSize(8)
    .text(order?.buyer?.fullName || "-", leftX + padding, billY);

  billY += 12;

  doc.text(
    order?.buyer?.businessProfile?.companyName || "-",
    leftX + padding,
    billY
  );

  billY += 12;

  doc.text(
    order?.buyer?.businessProfile?.billingAddress || "-",
    leftX + padding,
    billY,
    { width: boxWidth - 20 }
  );

  billY += 30;

  doc.text(
    `Phone: ${
      order?.buyer?.businessProfile?.phoneNumber || "-"
    }`,
    leftX + padding,
    billY
  );

  billY += 12;

  doc.text(
    `Email: ${order?.buyer?.email || "-"}`,
    leftX + padding,
    billY
  );

  billY += 12;

  doc.text(
    `GST: ${
      order?.buyer?.businessProfile?.gstNumber || "-"
    }`,
    leftX + padding,
    billY
  );

  /* =========================
     SHIP TO
  ========================= */

  doc
    .rect(rightX, currentY, boxWidth, 120)
    .stroke();

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("Ship To", rightX + padding, currentY + 8);

  let shipY = currentY + 28;

  doc
    .font("Helvetica")
    .fontSize(8)
    .text(
      order?.shippingAddress?.fullName || "-",
      rightX + padding,
      shipY
    );

  shipY += 12;

  doc.text(
    order?.buyer?.businessProfile?.companyName || "-",
    rightX + padding,
    shipY
  );

  shipY += 12;

  const fullAddress =
    order?.shippingAddress?.fullAddress ||
    [
      order?.shippingAddress?.flatHouse,
      order?.shippingAddress?.areaStreet,
      order?.shippingAddress?.landmark,
      order?.shippingAddress?.city,
      order?.shippingAddress?.state,
      order?.shippingAddress?.pincode,
    ]
      .filter(Boolean)
      .join(", ") ||
    "-";

  doc.text(fullAddress, rightX + padding, shipY, {
    width: boxWidth - 20,
  });

  shipY += 30;

  doc.text(
    `Phone: ${
      order?.shippingAddress?.mobileNumber || "-"
    }`,
    rightX + padding,
    shipY
  );

  shipY += 12;

  doc.text(
    `Email: ${order?.buyer?.email || "-"}`,
    rightX + padding,
    shipY
  );

  shipY += 12;

  doc.text(
    `GST: ${
      order?.buyer?.businessProfile?.gstNumber || "-"
    }`,
    rightX + padding,
    shipY
  );

  return currentY + 135;
};