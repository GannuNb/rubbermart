export const drawFooterSection = (
  doc,
  pageWidth,
  pageHeight,
) => {
  /*
  ==================================================
  FOOTER POSITION
  ==================================================
  */

  const footerY =
    pageHeight - 35;

  /*
  ==================================================
  FOOTER LINE
  ==================================================
  */

  doc
    .moveTo(
      40,
      footerY - 8,
    )
    .lineTo(
      pageWidth - 40,
      footerY - 8,
    )
    .lineWidth(0.5)
    .stroke("#dddddd");

  /*
  ==================================================
  LEFT
  ==================================================
  */

  doc
    .fillColor("#777777")
    .font("Helvetica")
    .fontSize(7)
    .text(
      "Transport Payment History Report",
      40,
      footerY,
      {
        width: 200,
      },
    );

  /*
  ==================================================
  GENERATED DATE
  ==================================================
  */

  doc
    .fillColor("#777777")
    .font("Helvetica")
    .fontSize(7)
    .text(
      `Generated on: ${new Date().toLocaleDateString(
        "en-IN",
      )}`,
      200,
      footerY,
      {
        width: 180,
        align: "center",
      },
    );

  /*
  ==================================================
  PAGE NUMBER
  ==================================================
  */

  doc
    .fillColor("#777777")
    .font("Helvetica-Bold")
    .fontSize(7)
    .text(
      `Page ${doc.page.number}`,
      pageWidth - 120,
      footerY,
      {
        width: 80,
        align: "right",
      },
    );
};