import { drawPaymentsSection } from "./paymentsSection.js";

const formatAmount = (value) => {
  const amount = Number(value || 0);

  return amount.toLocaleString("en-IN", {
    minimumFractionDigits: amount % 1 !== 0 ? 2 : 0,
    maximumFractionDigits: 2,
  });
};

const drawCellText = (
  doc,
  text,
  x,
  y,
  width,
  options = {},
) => {
  doc
    .fillColor(options.color || "#222222")
    .font(options.bold ? "Helvetica-Bold" : "Helvetica")
    .fontSize(options.fontSize || 8)
    .text(
      String(text ?? "-"),
      x + 7,
      y + 7,
      {
        width: width - 14,
        height: options.height || 18,
        ellipsis: true,
        align: options.align || "left",
      },
    );
};

const drawTableCell = (
  doc,
  x,
  y,
  width,
  height,
  options = {},
) => {
  doc
    .save()
    .rect(x, y, width, height)
    .lineWidth(0.5)
    .fillAndStroke(
      options.background || "#ffffff",
      options.border || "#d9d9d9",
    )
    .restore();
};

export const drawShipmentsSection = (
  doc,
  pageWidth,
  pageHeight,
  y,
  reportData,
  startNewPage,
) => {
  /*
  ==================================================
  SHIPMENTS
  ==================================================
  */

  const shipments = Array.isArray(reportData?.shipments)
    ? reportData.shipments
    : [];

  const left = 40;
  const right = 40;

  const tableWidth = pageWidth - left - right;

  /*
  ==================================================
  SECTION TITLE
  ==================================================
  */

  const drawSectionTitle = (title, positionY) => {
    doc
      .fillColor("#4b1d95")
      .font("Helvetica-Bold")
      .fontSize(13)
      .text(title, left, positionY);

    return positionY + 25;
  };

  y = drawSectionTitle(
    "SHIPMENT PAYMENT DETAILS",
    y,
  );

  /*
  ==================================================
  NO SHIPMENTS
  ==================================================
  */

  if (shipments.length === 0) {
    doc
      .fillColor("#666666")
      .font("Helvetica")
      .fontSize(10)
      .text(
        "No shipment payment records found.",
        left,
        y,
      );

    return y + 30;
  }

  /*
  ==================================================
  SHIPMENT LOOP
  ==================================================
  */

  shipments.forEach((shipment, index) => {
    /*
    ==================================================
    SHIPMENT TABLE HEIGHT
    ==================================================
    */

    const shipmentHeaderHeight = 30;

    const detailsHeaderHeight = 22;

    const detailsRowHeight = 30;

    const amountHeaderHeight = 22;

    const amountRowHeight = 30;

    const totalHeight =
      shipmentHeaderHeight +
      detailsHeaderHeight +
      detailsRowHeight +
      amountHeaderHeight +
      amountRowHeight;

    /*
    ==================================================
    PAGE BREAK
    ==================================================
    */

    if (y + totalHeight > pageHeight - 90) {
      y = startNewPage();

      y = drawSectionTitle(
        "SHIPMENT PAYMENT DETAILS",
        y,
      );
    }

    /*
    ==================================================
    SHIPMENT TITLE
    ==================================================
    */

    doc
      .fillColor("#4b1d95")
      .font("Helvetica-Bold")
      .fontSize(10)
      .text(
        `Shipment ${index + 1}`,
        left + 8,
        y + 9,
      );

    doc
      .fillColor("#555555")
      .font("Helvetica-Bold")
      .fontSize(8)
      .text(
        "Invoice:",
        left + tableWidth - 205,
        y + 10,
      );

    doc
      .fillColor("#222222")
      .font("Helvetica")
      .fontSize(8)
      .text(
        shipment?.shipmentInvoiceId || "-",
        left + tableWidth - 150,
        y + 10,
        {
          width: 140,
          ellipsis: true,
        },
      );

    y += shipmentHeaderHeight;

    /*
    ==================================================
    BASIC DETAILS TABLE
    ==================================================
    */

    const col1 = 100;
    const col2 = 175;
    const col3 = 100;
    const col4 =
      tableWidth - col1 - col2 - col3;

    /*
    ------------------------------------------
    HEADER ROW
    ------------------------------------------
    */

    let x = left;

    drawTableCell(
      doc,
      x,
      y,
      col1,
      detailsHeaderHeight,
      {
        background: "#f3f0fa",
      },
    );

    drawCellText(
      doc,
      "Order ID",
      x,
      y,
      col1,
      {
        bold: true,
        color: "#4b1d95",
      },
    );

    x += col1;

    drawTableCell(
      doc,
      x,
      y,
      col2,
      detailsHeaderHeight,
      {
        background: "#f3f0fa",
      },
    );

    drawCellText(
      doc,
      "Item",
      x,
      y,
      col2,
      {
        bold: true,
        color: "#4b1d95",
      },
    );

    x += col2;

    drawTableCell(
      doc,
      x,
      y,
      col3,
      detailsHeaderHeight,
      {
        background: "#f3f0fa",
      },
    );

    drawCellText(
      doc,
      "Status",
      x,
      y,
      col3,
      {
        bold: true,
        color: "#4b1d95",
      },
    );

    x += col3;

    drawTableCell(
      doc,
      x,
      y,
      col4,
      detailsHeaderHeight,
      {
        background: "#f3f0fa",
      },
    );

    drawCellText(
      doc,
      "Invoice",
      x,
      y,
      col4,
      {
        bold: true,
        color: "#4b1d95",
      },
    );

    /*
    ------------------------------------------
    VALUE ROW
    ------------------------------------------
    */

    y += detailsHeaderHeight;

    x = left;

    drawTableCell(
      doc,
      x,
      y,
      col1,
      detailsRowHeight,
    );

    drawCellText(
      doc,
      shipment?.orderNumber || "-",
      x,
      y,
      col1,
    );

    x += col1;

    drawTableCell(
      doc,
      x,
      y,
      col2,
      detailsRowHeight,
    );

    drawCellText(
      doc,
      shipment?.selectedItem || "-",
      x,
      y,
      col2,
    );

    x += col2;

    drawTableCell(
      doc,
      x,
      y,
      col3,
      detailsRowHeight,
    );

    drawCellText(
      doc,
      shipment?.shipmentStatus || "-",
      x,
      y,
      col3,
    );

    x += col3;

    drawTableCell(
      doc,
      x,
      y,
      col4,
      detailsRowHeight,
    );

    drawCellText(
      doc,
      shipment?.shipmentInvoiceId || "-",
      x,
      y,
      col4,
    );

    y += detailsRowHeight;

    /*
    ==================================================
    BUYER / SELLER TABLE
    ==================================================
    */

    const partyCol1 = tableWidth / 2;
    const partyCol2 = tableWidth / 2;

    /*
    ------------------------------------------
    HEADER
    ------------------------------------------
    */

    x = left;

    drawTableCell(
      doc,
      x,
      y,
      partyCol1,
      detailsHeaderHeight,
      {
        background: "#f3f0fa",
      },
    );

    drawCellText(
      doc,
      "Buyer",
      x,
      y,
      partyCol1,
      {
        bold: true,
        color: "#4b1d95",
      },
    );

    x += partyCol1;

    drawTableCell(
      doc,
      x,
      y,
      partyCol2,
      detailsHeaderHeight,
      {
        background: "#f3f0fa",
      },
    );

    drawCellText(
      doc,
      "Seller",
      x,
      y,
      partyCol2,
      {
        bold: true,
        color: "#4b1d95",
      },
    );

    /*
    ------------------------------------------
    VALUES
    ------------------------------------------
    */

    y += detailsHeaderHeight;

    x = left;

    drawTableCell(
      doc,
      x,
      y,
      partyCol1,
      detailsRowHeight,
    );

    drawCellText(
      doc,
      shipment?.buyer || "-",
      x,
      y,
      partyCol1,
    );

    x += partyCol1;

    drawTableCell(
      doc,
      x,
      y,
      partyCol2,
      detailsRowHeight,
    );

    drawCellText(
      doc,
      shipment?.seller || "-",
      x,
      y,
      partyCol2,
    );

    y += detailsRowHeight;

    /*
    ==================================================
    PAYMENT AMOUNTS TABLE
    ==================================================
    */

    const amountCol =
      tableWidth / 4;

    /*
    ------------------------------------------
    HEADER
    ------------------------------------------
    */

    const amountHeaders = [
      "Transport",
      "Received",
      "Remaining (DUE)",
      "Payment Status",
    ];

    x = left;

    amountHeaders.forEach((header) => {
      drawTableCell(
        doc,
        x,
        y,
        amountCol,
        amountHeaderHeight,
        {
          background: "#f3f0fa",
        },
      );

      drawCellText(
        doc,
        header,
        x,
        y,
        amountCol,
        {
          bold: true,
          color: "#4b1d95",
          align: "center",
        },
      );

      x += amountCol;
    });

    /*
    ------------------------------------------
    VALUES
    ------------------------------------------
    */

    y += amountHeaderHeight;

    const amountValues = [
      {
        value: formatAmount(
          shipment?.transportAmount,
        ),
        color: "#222222",
      },
      {
        value: formatAmount(
          shipment?.totalReceived,
        ),
        color: "#188038",
      },
      {
        value: formatAmount(
          shipment?.remainingAmount,
        ),
        color: "#d97706",
      },
      {
        value:
          shipment?.remainingAmount > 0
            ? "Pending"
            : "Paid",
        color:
          shipment?.remainingAmount > 0
            ? "#d97706"
            : "#188038",
      },
    ];

    x = left;

    amountValues.forEach((item) => {
      drawTableCell(
        doc,
        x,
        y,
        amountCol,
        amountRowHeight,
      );

      drawCellText(
        doc,
        item.value,
        x,
        y,
        amountCol,
        {
          bold: true,
          color: item.color,
          align: "center",
          fontSize: 9,
        },
      );

      x += amountCol;
    });

    y += amountRowHeight;

    /*
    ==================================================
    PAYMENT HISTORY
    ==================================================
    */

    y += 12;

    y = drawPaymentsSection(
      doc,
      pageWidth,
      pageHeight,
      y,
      shipment?.payments || [],
      startNewPage,
    );

    /*
    ==================================================
    NEXT SHIPMENT
    ==================================================
    */

    y += 15;
  });

  return y;
};