export const drawBankingDetailsSection = (doc, startY) => {
  let currentY = startY + 10;

  const startX = 35;
  const boxWidth = 525;

  doc.rect(startX, currentY, boxWidth, 70).stroke();

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("Bank Details", startX + 10, currentY + 8);

  doc
    .font("Helvetica")
    .fontSize(8)
    .text("Account Name : Rubber Scrap Mart", startX + 10, currentY + 25)
    .text("Bank Name : HDFC Bank", startX + 10, currentY + 38)
    .text("Account No : XXXXXXXX1234", startX + 10, currentY + 51)
    .text("IFSC Code : HDFC0001234", startX + 250, currentY + 25);

  return currentY + 80;
};