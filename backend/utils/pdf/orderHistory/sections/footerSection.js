import { invoiceColors } from "../../styles.js";

const {
  lightText,
  borderColor,
} = invoiceColors;

export const drawFooterSection = (
  doc,
  startY,
) => {
  let y = startY + 20;

  doc
    .moveTo(35, y)
    .lineTo(560, y)
    .strokeColor(borderColor)
    .lineWidth(0.6)
    .stroke();

  y += 15;

  doc
    .fillColor(lightText)
    .font("Helvetica")
    .fontSize(8)
    .text(
      "This is a system generated Order History Report from Rubber Scrap Mart.",
      35,
      y,
      {
        align: "center",
        width: 525,
      },
    );

  y += 15;

  doc
    .font("Helvetica")
    .fontSize(7)
    .text(
      "Generated on : " +
        new Date().toLocaleString("en-IN"),
      35,
      y,
      {
        align: "center",
        width: 525,
      },
    );
};