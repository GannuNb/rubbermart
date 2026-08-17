export const drawTransporterSection = (
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
      "TRANSPORTER DETAILS",
      40,
      y,
    );

  y += 25;

  /*
  ==================================================
  DETAILS BOX
  ==================================================
  */

  const boxX = 40;
  const boxWidth = pageWidth - 80;
  const boxHeight = 65;

  doc
    .roundedRect(
      boxX,
      y,
      boxWidth,
      boxHeight,
      6,
    )
    .lineWidth(0.8)
    .stroke("#d6d6d6");

  /*
  ==================================================
  TRANSPORTER
  ==================================================
  */

  doc
    .fillColor("#555555")
    .font("Helvetica-Bold")
    .fontSize(9)
    .text(
      "Transporter",
      boxX + 15,
      y + 12,
    );

  doc
    .fillColor("#222222")
    .font("Helvetica")
    .fontSize(10)
    .text(
      reportData?.transporter?.fullName || "-",
      boxX + 15,
      y + 28,
      {
        width: 200,
        height: 15,
        ellipsis: true,
      },
    );

  /*
  ==================================================
  COMPANY
  ==================================================
  */

  doc
    .fillColor("#555555")
    .font("Helvetica-Bold")
    .fontSize(9)
    .text(
      "Company",
      boxX + 250,
      y + 12,
    );

  doc
    .fillColor("#222222")
    .font("Helvetica")
    .fontSize(10)
    .text(
      reportData?.transporter?.companyName || "-",
      boxX + 250,
      y + 28,
      {
        width: 200,
        height: 15,
        ellipsis: true,
      },
    );

  /*
  ==================================================
  RETURN
  ==================================================
  */

  return y + boxHeight + 20;
};