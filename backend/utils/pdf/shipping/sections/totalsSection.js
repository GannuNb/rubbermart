export const drawTotalsSection = (doc, order, shipment, startY) => {
  let currentY = startY;

  const startX = 35;
  const boxWidth = 525;

  const height = 70;

  /* =========================
     CALCULATE TOTALS
  ========================= */

  const shipmentItems = shipment?.items || [];

  let taxableAmount = 0;

  shipmentItems.forEach((item) => {
    const qty = Number(item?.shippedQuantity || 0);
    const price = Number(item?.pricePerMT || 0);

    taxableAmount += qty * price;
  });

  const gstAmount = taxableAmount * 0.18;
  const totalAmount = taxableAmount + gstAmount;

  /* =========================
     DRAW BOX
  ========================= */

  doc.rect(startX, currentY, boxWidth, height).stroke();

  /* =========================
     LABELS + VALUES
  ========================= */

  doc.font("Helvetica-Bold").fontSize(9);

  // Taxable
  doc.text("Taxable Value", 300, currentY + 15);
  doc
    .font("Helvetica")
    .text(taxableAmount.toFixed(2), 450, currentY + 15);

  // GST
  doc
    .font("Helvetica-Bold")
    .text("GST (18%)", 300, currentY + 32);

  doc
    .font("Helvetica")
    .text(gstAmount.toFixed(2), 450, currentY + 32);

  // Total
  doc
    .font("Helvetica-Bold")
    .text("Grand Total", 300, currentY + 50);

  doc
    .font("Helvetica-Bold")
    .text(totalAmount.toFixed(2), 450, currentY + 50);

  return currentY + height + 10;
};