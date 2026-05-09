
// backend/utils/pdf/buyReport/sections/headerSection.js

const addHeaderSection = (
  doc,
  order,
  logoPath
) => {
  /* =========================
     COMMON TOP ALIGNMENT
  ========================= */

  const topY = 32;

  /* =========================
     LOGO
  ========================= */

  try {
    doc.image(
      logoPath,
      40,
      topY - 8,
      {
        width: 145,
      }
    );
  } catch (error) {
    console.log(
      "Logo load error:",
      error.message
    );
  }

  /* =========================
     TITLE
  ========================= */

  doc
    .fontSize(25)
    .fillColor("#7d3cb5")
    .font("Helvetica-Bold")
    .text(
      "BUY REPORT",
      220,
      topY + 2
    );

  /* SUBTITLE */

  doc
    .fontSize(10)
    .fillColor("#666666")
    .font("Helvetica")
    .text(
      "All Payments & Shipping Details",
      220,
      topY + 34
    );

  /* =========================
     RIGHT INFO CARD
  ========================= */

  doc
    .roundedRect(
      425,
      topY - 2,
      130,
      52,
      10
    )
    .fillAndStroke(
      "#F8F5FF",
      "#E7D8FA"
    );

  /* ORDER ID ROW */

  doc
    .fillColor("#555555")
    .font("Helvetica-Bold")
    .fontSize(8)
    .text(
      "Order ID :",
      438,
      topY + 12
    );

  doc
    .fillColor("#7d3cb5")
    .font("Helvetica-Bold")
    .fontSize(8)
    .text(
      order.orderId,
      490,
      topY + 12
    );

  /* ORDER DATE ROW */

  doc
    .fillColor("#555555")
    .font("Helvetica-Bold")
    .fontSize(8)
    .text(
      "Order Date :",
      438,
      topY + 28
    );

  doc
    .fillColor("#666666")
    .font("Helvetica")
    .fontSize(8)
    .text(
      new Date(
        order.createdAt
      ).toLocaleDateString(),
      500,
      topY + 28
    );

  /* =========================
     BOTTOM LINE
  ========================= */

  doc
    .moveTo(40, 112)
    .lineTo(555, 112)
    .strokeColor("#E9DDFC")
    .lineWidth(1)
    .stroke();
};

export default addHeaderSection;

