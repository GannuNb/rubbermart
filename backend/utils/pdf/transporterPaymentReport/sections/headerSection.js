import path from "path";
import fs from "fs";

export const drawHeader = (
  doc,
  pageWidth,
  pageHeight,
  reportData,
) => {
  /*
  ==================================================
  HEADER GRADIENT
  ==================================================
  */

  const headerGradient = doc.linearGradient(
    0,
    0,
    pageWidth,
    0,
  );

  /*
  --------------------------------------------------
  Purple theme
  --------------------------------------------------
  The left side is lighter so the logo remains
  clearly visible without adding a separate panel.
  */

  headerGradient.stop(
    0,
    "#9a5ee8",
  );

  headerGradient.stop(
    0.3,
    "#8243df",
  );

  headerGradient.stop(
    0.65,
    "#6d2fc4",
  );

  headerGradient.stop(
    1,
    "#5318b8",
  );

  /*
  ==================================================
  HEADER SHAPE
  ==================================================
  */

  doc
    .save()
    .moveTo(0, 0)
    .lineTo(pageWidth, 0)
    .lineTo(pageWidth, 85)
    .lineTo(0, 110)
    .closePath()
    .fill(headerGradient)
    .restore();

  /*
  ==================================================
  GOLD LINE
  ==================================================
  */

  doc
    .save()
    .moveTo(0, 100)
    .lineTo(pageWidth, 72)
    .lineTo(pageWidth, 82)
    .lineTo(0, 110)
    .closePath()
    .fill("#d3a85e")
    .restore();

  /*
  ==================================================
  LOGO
  ==================================================
  */

  const logoPath = path.join(
    process.cwd(),
    "../rubberproject/public/invoice_logo.png",
  );

  const fallbackLogoPath = path.join(
    process.cwd(),
    "rubberproject/public/invoice_logo.png",
  );

  const finalLogo = fs.existsSync(logoPath)
    ? logoPath
    : fs.existsSync(fallbackLogoPath)
      ? fallbackLogoPath
      : null;

  /*
  --------------------------------------------------
  DRAW LOGO
  --------------------------------------------------
  */

  if (finalLogo) {
    doc.image(
      finalLogo,
      35,
      10,
      {
        fit: [145, 75],
        align: "center",
        valign: "center",
      },
    );
  }

  /*
  ==================================================
  REPORT TITLE
  ==================================================
  */

  doc
    .fillColor("#ffffff")
    .font("Helvetica-Bold")
    .fontSize(18)
    .text(
      "PAYMENT REPORT",
      235,
      25,
      {
        width: 320,
        align: "left",
      },
    );

  /*
  ==================================================
  COMPANY DETAILS
  ==================================================
  */

  doc
    .fillColor("#222222")
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(
      "Rubber Scrap Mart",
      40,
      125,
    );

  /*
  ==================================================
  COMPANY ADDRESS
  ==================================================
  */

  doc
    .fillColor("#222222")
    .font("Helvetica")
    .fontSize(7)
    .text(
      "Office No. 217,\n" +
        "Skylark Premises Co-operative Society Ltd,\n" +
        "Plot No. 63, Sector 11, CBD Belapur,\n" +
        "Navi Mumbai - 400614,\n" +
        "GSTIN : 27AAVFV4635R1ZY",
      40,
      145,
      {
        width: 280,
        lineGap: 2,
      },
    );

  /*
  ==================================================
  REPORT DATE
  ==================================================
  */

  const reportDate = reportData?.generatedAt
    ? new Date(
        reportData.generatedAt,
      ).toLocaleDateString("en-IN")
    : new Date().toLocaleDateString("en-IN");

  /*
  ==================================================
  REPORT DATE LABEL
  ==================================================
  */

  doc
    .fillColor("#222222")
    .font("Helvetica-Bold")
    .fontSize(9)
    .text(
      "Report Date",
      430,
      130,
      {
        width: 100,
        align: "left",
      },
    );

  /*
  ==================================================
  REPORT DATE VALUE
  ==================================================
  */

  doc
    .fillColor("#222222")
    .font("Helvetica")
    .fontSize(9)
    .text(
      reportDate,
      430,
      145,
      {
        width: 100,
        align: "left",
      },
    );
};