export const PAGE = {
  width: 595,
  height: 842,
  marginTop: 35,
  marginBottom: 40,
};

export const drawPageBorder = (doc) => {
  doc
    .rect(
      2,
      2,
      PAGE.width - 4,
      PAGE.height - 4
    )
    .lineWidth(1)
    .stroke("#000000");
};

export const ensurePageSpace = (
  doc,
  currentY,
  requiredHeight,
) => {
  const availableHeight =
    PAGE.height - PAGE.marginBottom;

  if (currentY + requiredHeight > availableHeight) {
    doc.addPage({
      size: "A4",
      margin: 0,
    });

    drawPageBorder(doc);

    return PAGE.marginTop;
  }

  return currentY;
};