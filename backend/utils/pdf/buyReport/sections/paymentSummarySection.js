
// backend/utils/pdf/buyReport/sections/paymentSummarySection.js

const addPaymentSummarySection = (
  doc,
  order
) => {
  /* =========================
     TITLE
  ========================= */

  doc
    .fontSize(16)
    .fillColor("#5B3FD0")
    .font("Helvetica-Bold")
    .text(
      "PAYMENTS SUMMARY",
      40,
      145
    );

  /* TITLE LINE */

  doc
    .moveTo(210, 154)
    .lineTo(555, 154)
    .strokeColor("#E8E2FF")
    .lineWidth(1)
    .stroke();

  /* =========================
     MAIN WRAPPER
  ========================= */

  doc
    .roundedRect(40, 180, 515, 95, 12)
    .fillAndStroke(
      "#FFFFFF",
      "#E5E7EB"
    );

  /* =========================
     CARD DATA
  ========================= */

  const cards = [
    {
      title: "Total Amount",
      value: `Rs. ${Number(
        order.totalAmount || 0
      ).toLocaleString()}`,
      bg: "#F3F0FF",
      valueColor: "#5B3FD0",
      x: 58,
    },

    {
      title: "Amount Paid",
      value: `Rs. ${Number(
        order.buyerPaidAmount || 0
      ).toLocaleString()}`,
      bg: "#ECFDF3",
      valueColor: "#16A34A",
      x: 225,
    },

    {
      title: "Remaining Amount",
      value: `Rs. ${Number(
        order.buyerPendingAmount || 0
      ).toLocaleString()}`,
      bg: "#FEF3F2",
      valueColor: "#DC2626",
      x: 392,
    },
  ];

  /* =========================
     RENDER CARDS
  ========================= */

  cards.forEach((card) => {
    /* CARD BG */

    doc
      .roundedRect(
        card.x,
        198,
        145,
        58,
        10
      )
      .fill(card.bg);

    /* TITLE */

    doc
      .fillColor("#666666")
      .fontSize(8)
      .font("Helvetica")
      .text(
        card.title,
        card.x + 12,
        212
      );

    /* VALUE */

    doc
      .fillColor(card.valueColor)
      .fontSize(13)
      .font("Helvetica-Bold")
      .text(
        card.value,
        card.x + 12,
        228
      );
  });
};

export default addPaymentSummarySection;

