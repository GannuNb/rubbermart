const formatAmount = (value) => {
  const amount = Number(value || 0);

  return amount.toLocaleString("en-IN", {
    minimumFractionDigits:
      amount % 1 !== 0 ? 2 : 0,

    maximumFractionDigits: 2,
  });
};

export const drawPaymentsSection = (
  doc,
  pageWidth,
  pageHeight,
  y,
  payments = [],
  startNewPage,
) => {
  /*
  ==================================================
  CONSTANTS
  ==================================================
  */

  const left = 52;
  const contentWidth = pageWidth - 104;

  /*
  ==================================================
  TITLE
  ==================================================
  */

  const drawPaymentTitle = (
    title,
    positionY,
  ) => {
    doc
      .fillColor("#4b1d95")
      .font("Helvetica-Bold")
      .fontSize(10)
      .text(
        title,
        left,
        positionY,
      );

    return positionY + 18;
  };

  y = drawPaymentTitle(
    "PAYMENT HISTORY",
    y,
  );

  /*
  ==================================================
  NO PAYMENTS
  ==================================================
  */

  if (
    !Array.isArray(payments) ||
    payments.length === 0
  ) {
    doc
      .fillColor("#777777")
      .font("Helvetica")
      .fontSize(8)
      .text(
        "No verified payments received.",
        left,
        y,
      );

    return y + 25;
  }

  /*
  ==================================================
  PAYMENT CARD
  ==================================================
  */

  const paymentHeight = 70;

  /*
  ==================================================
  LOOP
  ==================================================
  */

  payments.forEach(
    (payment, index) => {
      /*
      ------------------------------------------
      PAGE BREAK
      ------------------------------------------
      */

      if (
        y + paymentHeight >
        pageHeight - 55
      ) {
        y = startNewPage();

        y = drawPaymentTitle(
          "PAYMENT HISTORY (CONTINUED)",
          y,
        );
      }

      /*
      ------------------------------------------
      CARD
      ------------------------------------------
      */

      doc
        .save()
        .roundedRect(
          left,
          y,
          contentWidth,
          paymentHeight,
          5,
        )
        .lineWidth(0.6)
        .stroke("#dddddd")
        .restore();

      /*
      ------------------------------------------
      PAYMENT NUMBER
      ------------------------------------------
      */

      doc
        .fillColor("#4b1d95")
        .font("Helvetica-Bold")
        .fontSize(8)
        .text(
          `Payment ${index + 1}`,
          left + 10,
          y + 8,
        );

      /*
      ------------------------------------------
      AMOUNT
      ------------------------------------------
      */

      doc
        .fillColor("#188038")
        .font("Helvetica-Bold")
        .fontSize(11)
        .text(
          formatAmount(
            payment?.amount,
          ),
          left + 10,
          y + 25,
          {
            width: 80,
          },
        );

      /*
      ------------------------------------------
      PAYMENT MODE
      ------------------------------------------
      */

      doc
        .fillColor("#555555")
        .font("Helvetica-Bold")
        .fontSize(7)
        .text(
          "Payment Mode",
          left + 105,
          y + 10,
        );

      doc
        .fillColor("#222222")
        .font("Helvetica")
        .fontSize(8)
        .text(
          payment?.paymentMode || "-",
          left + 105,
          y + 24,
          {
            width: 90,
            height: 12,
            ellipsis: true,
          },
        );

      /*
      ------------------------------------------
      TRANSACTION ID
      ------------------------------------------
      */

      doc
        .fillColor("#555555")
        .font("Helvetica-Bold")
        .fontSize(7)
        .text(
          "Transaction ID",
          left + 205,
          y + 10,
        );

      doc
        .fillColor("#222222")
        .font("Helvetica")
        .fontSize(8)
        .text(
          payment?.transactionId || "-",
          left + 205,
          y + 24,
          {
            width: 125,
            height: 12,
            ellipsis: true,
          },
        );

      /*
      ------------------------------------------
      DATE
      ------------------------------------------
      */

      doc
        .fillColor("#555555")
        .font("Helvetica-Bold")
        .fontSize(7)
        .text(
          "Date",
          left + 345,
          y + 10,
        );

      doc
        .fillColor("#222222")
        .font("Helvetica")
        .fontSize(8)
        .text(
          payment?.createdAt
            ? new Date(
                payment.createdAt,
              ).toLocaleDateString(
                "en-IN",
              )
            : "-",
          left + 345,
          y + 24,
          {
            width: 100,
          },
        );

      /*
      ------------------------------------------
      NOTE
      ------------------------------------------
      */

      doc
        .fillColor("#555555")
        .font("Helvetica-Bold")
        .fontSize(7)
        .text(
          "Note:",
          left + 10,
          y + 48,
        );

      doc
        .fillColor("#444444")
        .font("Helvetica")
        .fontSize(7)
        .text(
          payment?.note || "-",
          left + 40,
          y + 48,
          {
            width:
              contentWidth - 50,
            height: 12,
            ellipsis: true,
          },
        );

      /*
      ------------------------------------------
      NEXT PAYMENT
      ------------------------------------------
      */

      y += paymentHeight + 7;
    },
  );

  return y + 5;
};