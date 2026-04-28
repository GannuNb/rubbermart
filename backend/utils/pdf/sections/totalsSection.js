import { invoiceColors } from "../styles.js";
const { borderColor, darkText } = invoiceColors;

export const drawTotalsSection = (doc, order, currentY) => {
  const height = 70;
  const startX = 35;
  const tableWidth = 525;

  // Draw border box
  doc
    .rect(startX, currentY, tableWidth, height)
    .strokeColor(borderColor)
    .stroke();

  // Vertical separators aligned with Items Table
  [72, 155, 210, 278, 340, 425].forEach((x) => {
    doc
      .moveTo(x, currentY)
      .lineTo(x, currentY + height)
      .stroke();
  });

  doc
    .fillColor(darkText)
    .font("Helvetica-Bold");

  /* =========================
     CGST + SGST
  ========================= */

  if (order.gstType === "cgst_sgst") {
    doc

      // reduced font size here
      .fontSize(6.5)
      .text("TAXABLE VALUE", 282, currentY + 15, {
        width: 55,
        align: "center",
      })

      .fontSize(7.5)
      .text(
        Number(order.taxableAmount || 0).toFixed(2),
        282,
        currentY + 35,
        {
          width: 55,
          align: "center",
        }
      )

      .fontSize(6.5)
      .text("CGST + SGST", 345, currentY + 15, {
        width: 75,
        align: "center",
      })

      .fontSize(7.5)
      .text(
        Number(order.gstAmount || 0).toFixed(2),
        345,
        currentY + 35,
        {
          width: 75,
          align: "center",
        }
      )

      // reduced GRAND TOTAL font size here
      .fontSize(8.5)
      .text("GRAND TOTAL", 432, currentY + 15, {
        width: 115,
        align: "center",
      })

      .fontSize(8.5)
      .text(
        Number(order.totalAmount || 0).toFixed(2),
        432,
        currentY + 35,
        {
          width: 115,
          align: "center",
        }
      );
  }

  /* =========================
     IGST
  ========================= */

  else {
    doc

      // reduced font size here
      .fontSize(6.5)
      .text("TAXABLE VALUE", 282, currentY + 15, {
        width: 55,
        align: "center",
      })

      .fontSize(7.5)
      .text(
        Number(order.taxableAmount || 0).toFixed(2),
        282,
        currentY + 35,
        {
          width: 55,
          align: "center",
        }
      )

      .fontSize(6.5)
      .text("IGST (18%)", 345, currentY + 15, {
        width: 75,
        align: "center",
      })

      .fontSize(7.5)
      .text(
        Number(order.igstAmount || 0).toFixed(2),
        345,
        currentY + 35,
        {
          width: 75,
          align: "center",
        }
      )

      // reduced GRAND TOTAL font size here
      .fontSize(8.5)
      .text("GRAND TOTAL", 432, currentY + 15, {
        width: 115,
        align: "center",
      })

      .fontSize(8.5)
      .text(
        Number(order.totalAmount || 0).toFixed(2),
        432,
        currentY + 35,
        {
          width: 115,
          align: "center",
        }
      );
  }

  return currentY + height + 10;
};