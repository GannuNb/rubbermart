import { invoiceColors } from "../../styles.js";

const {
  primaryPurple,
  borderColor,
  darkText,
} = invoiceColors;

export const drawItemsTableSection = (doc, order, startY) => {
  let y = startY;

  /* =========================
      SECTION TITLE
  ========================= */

  doc
    .roundedRect(35, y, 525, 24, 4)
    .fill(primaryPurple);

  doc
    .fillColor("#ffffff")
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("ORDER ITEMS", 48, y + 7);

  y += 35;

  /* =========================
      TABLE HEADER
  ========================= */

  const columns = [
    { label: "S.No", x: 38, width: 35 },
    { label: "Product", x: 75, width: 135 },
    { label: "Category", x: 210, width: 90 },
    { label: "Qty (MT)", x: 300, width: 55 },
    { label: "Price/MT", x: 355, width: 75 },
    { label: "HSN", x: 430, width: 55 },
    { label: "Subtotal", x: 485, width: 70 },
  ];

  doc
    .rect(35, y, 525, 24)
    .fill(primaryPurple);

  doc
    .fillColor("#ffffff")
    .font("Helvetica-Bold")
    .fontSize(8);

  columns.forEach((col) => {
    doc.text(col.label, col.x, y + 8, {
      width: col.width,
      align: "center",
    });
  });

  y += 24;

  /* =========================
      TABLE ROWS
  ========================= */

  let grandTotal = 0;

  order?.orderItems?.forEach((item, index) => {
    const rowHeight = 32;

    doc
      .rect(35, y, 525, rowHeight)
      .lineWidth(0.4)
      .strokeColor(borderColor)
      .stroke();

    doc
      .fillColor(darkText)
      .font("Helvetica")
      .fontSize(8);

    doc.text(index + 1, 38, y + 11, {
      width: 35,
      align: "center",
    });

    doc.text(
      item?.productName || "-",
      75,
      y + 6,
      {
        width: 130,
      }
    );

    doc.text(
      item?.category || "-",
      210,
      y + 11,
      {
        width: 90,
        align: "center",
      }
    );

    doc.text(
      item?.requiredQuantity?.toString() || "0",
      300,
      y + 11,
      {
        width: 55,
        align: "center",
      }
    );

    doc.text(
      `${Number(item?.pricePerMT || 0).toLocaleString("en-IN")}`,
      355,
      y + 11,
      {
        width: 75,
        align: "center",
      }
    );

    doc.text(
      item?.hsnCode || "-",
      430,
      y + 11,
      {
        width: 55,
        align: "center",
      }
    );

    doc.text(
      `${Number(item?.subtotal || 0).toLocaleString("en-IN")}`,
      485,
      y + 11,
      {
        width: 70,
        align: "center",
      }
    );

    grandTotal += Number(item?.subtotal || 0);

    y += rowHeight;
  });

  /* =========================
      GRAND TOTAL
  ========================= */

  y += 8;

  doc
    .roundedRect(360, y, 200, 28, 4)
    .fill(primaryPurple);

  doc
    .fillColor("#ffffff")
    .font("Helvetica-Bold")
    .fontSize(10)
    .text(
      `Order Items Total : ${grandTotal.toLocaleString("en-IN")}`,
      370,
      y + 9
    );

  return y + 45;
};