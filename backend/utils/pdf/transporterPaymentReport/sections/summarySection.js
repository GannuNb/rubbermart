const formatAmount = (value) => {
  const amount = Number(value || 0);

  return amount.toLocaleString("en-IN", {
    minimumFractionDigits:
      amount % 1 !== 0 ? 2 : 0,

    maximumFractionDigits: 2,
  });
};

export const drawSummarySection = (
  doc,
  pageWidth,
  y,
  reportData,
) => {
  /*
  ==================================================
  SECTION TITLE
  ==================================================
  */

  doc
    .fillColor("#4b1d95")
    .font("Helvetica-Bold")
    .fontSize(13)
    .text(
      "PAYMENT SUMMARY",
      40,
      y,
    );

  y += 25;

  /*
  ==================================================
  SUMMARY
  ==================================================
  */

  const totalTransportAmount = Number(
    reportData?.summary?.totalTransportAmount || 0,
  );

  const totalReceived = Number(
    reportData?.summary?.totalReceived || 0,
  );

  const totalRemaining = Number(
    reportData?.summary?.totalRemaining || 0,
  );

  /*
  ==================================================
  CARD SETTINGS
  ==================================================
  */

  const margin = 40;
  const gap = 12;

  const cardWidth =
    (pageWidth - margin * 2 - gap * 2) / 3;

  const cardHeight = 75;

  /*
  ==================================================
  CARDS
  ==================================================
  */

  const cards = [
    {
      title: "Total Transport",
      amount: totalTransportAmount,
    },
    {
      title: "Total Received",
      amount: totalReceived,
    },
    {
      title: "Total Remaining (DUE) ",
      amount: totalRemaining,
    },
  ];

  cards.forEach((card, index) => {
    const x =
      margin +
      index * (cardWidth + gap);

    /*
    ------------------------------------------
    CARD
    ------------------------------------------
    */

    doc
      .save()
      .roundedRect(
        x,
        y,
        cardWidth,
        cardHeight,
        6,
      )
      .lineWidth(0.8)
      .stroke("#d6d6d6")
      .restore();

    /*
    ------------------------------------------
    TITLE
    ------------------------------------------
    */

    doc
      .fillColor("#666666")
      .font("Helvetica-Bold")
      .fontSize(8)
      .text(
        card.title,
        x + 10,
        y + 12,
        {
          width: cardWidth - 20,
          align: "center",
        },
      );

    /*
    ------------------------------------------
    AMOUNT
    ------------------------------------------

    IMPORTANT:
    Do NOT use ₹ here.

    Helvetica does not properly support
    the Indian Rupee symbol.
    */

    doc
      .fillColor("#222222")
      .font("Helvetica-Bold")
      .fontSize(14)
      .text(
        formatAmount(card.amount),
        x + 8,
        y + 35,
        {
          width: cardWidth - 16,
          align: "center",
        },
      );
  });

  /*
  ==================================================
  RETURN
  ==================================================
  */

  return y + cardHeight + 25;
};