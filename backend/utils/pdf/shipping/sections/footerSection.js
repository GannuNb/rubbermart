export const drawFooterSection = (doc, startY) => {
  const footerY = startY + 20;

  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor("#666")
    .text(
      "This is a system generated Shipping Invoice.",
      35,
      footerY
    );

  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .text(
      "Authorized Signatory",
      420,
      footerY + 40
    );
};