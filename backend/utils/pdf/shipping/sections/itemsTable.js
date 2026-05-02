export const drawItemsTable = (doc, order, shipment, startY) => {
  let currentY = startY;

  const startX = 35;
  const tableWidth = 525;
  const headerHeight = 22;

  const colX = {
    sno: 35,
    item: 80,
    qty: 200,
    price: 280,
    total: 380,
  };

  /* =========================
     HEADER
  ========================= */

  doc
    .rect(startX, currentY, tableWidth, headerHeight)
    .fill("#6859c9");

  doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(8);

  doc.text("S.NO", colX.sno + 5, currentY + 7);
  doc.text("Item Name", colX.item, currentY + 7);
  doc.text("Shipped Qty", colX.qty, currentY + 7);
  doc.text("Price/MT", colX.price, currentY + 7);
  doc.text("Total", colX.total, currentY + 7);

  currentY += headerHeight;

  /* =========================
     MAP SHIPMENT ITEMS
  ========================= */

  const shipmentItems = shipment?.items || [];

  shipmentItems.forEach((item, index) => {
    const itemName =
      item?.application || item?.productName || "-";

    const qty = Number(item?.shippedQuantity || 0);
    const price = Number(item?.pricePerMT || 0);

    const total = qty * price;

    const rowHeight = 25;

    doc
      .rect(startX, currentY, tableWidth, rowHeight)
      .stroke();

    doc.fillColor("#222").font("Helvetica").fontSize(8);

    doc.text(index + 1, colX.sno + 8, currentY + 8);
    doc.text(itemName, colX.item, currentY + 8, {
      width: 100,
    });

    doc.text(qty, colX.qty, currentY + 8);
    doc.text(price.toFixed(2), colX.price, currentY + 8);
    doc.text(total.toFixed(2), colX.total, currentY + 8);

    currentY += rowHeight;
  });

  return currentY + 10;
};