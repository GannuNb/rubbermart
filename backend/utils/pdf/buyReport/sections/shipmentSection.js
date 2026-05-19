// backend/utils/pdf/buyReport/sections/shipmentSection.js

const addShipmentSection = (doc, order) => {
  /* =========================
     TITLE
  ========================= */

  let currentY = 320;

  doc
    .fontSize(16)
    .fillColor("#7d3cb5")
    .font("Helvetica-Bold")
    .text("SHIPPING DETAILS", 40, currentY);

  /* TITLE LINE */

  doc
    .moveTo(210, 329)
    .lineTo(555, 329)
    .strokeColor("#E9DDFC")
    .lineWidth(1)
    .stroke();

  currentY += 28;

  /* =========================
     EMPTY STATE
  ========================= */

  if (!order.shipments || order.shipments.length === 0) {
    doc
      .fontSize(11)
      .fillColor("#666666")
      .font("Helvetica")
      .text("No shipment data available", 40, currentY);

    return currentY + 40;
  }

  /* =========================
     SHIPMENT LOOP
  ========================= */

  order.shipments.forEach((shipment) => {
    /*
    =========================================
    FLEXIBLE PAGE BREAK
    =========================================

    Only move to next page IF card
    cannot fit in remaining space.
    */

    const estimatedCardHeight = 350;

    if (currentY + estimatedCardHeight > 760) {
      doc.addPage();

      currentY = 50;
    }

    /* =========================
       ITEM DETAILS
    ========================= */

    const selectedOrderItem = order.orderItems?.find(
      (item) => item.productName === shipment.selectedItem,
    );

    /* =========================
       CALCULATIONS
    ========================= */

    const pricePerMT = selectedOrderItem?.pricePerMT || 0;

    const qty = shipment.shippedQuantity || 0;

    const taxableAmount = qty * pricePerMT;

    let gstLabel = "";
    let gstAmount = 0;

    if (order.gstType === "igst") {
      gstLabel = "IGST 18%";

      gstAmount = taxableAmount * 0.18;
    } else {
      gstLabel = "CGST 9% + SGST 9%";

      gstAmount = taxableAmount * 0.18;
    }

    const finalAmount = taxableAmount + gstAmount;

    /*
    =========================================
    MAIN CARD
    =========================================
    */

    const cardHeight = 335;

    doc
      .roundedRect(40, currentY, 515, cardHeight, 12)
      .fillAndStroke("#FFFFFF", "#E5E7EB");

    /*
    =========================================
    HEADER BAR
    =========================================
    */

    doc.roundedRect(40, currentY, 515, 38, 12).fill("#F3ECFC");

    /*
    =========================================
    ORDER ID
    =========================================
    */

    doc
      .fillColor("#222222")
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("Order ID:", 55, currentY + 14);

    doc
      .fillColor("#7d3cb5")
      .fontSize(10)
      .text(order.orderId, 110, currentY + 14);

    /*
    =========================================
    STATUS
    =========================================
    */

    let statusText = "Pending";
    let statusBg = "#FEF3C7";
    let statusColor = "#D97706";

    if (shipment.shipmentStatus === "delivered") {
      statusText = "Shipped";

      statusBg = "#DCFCE7";

      statusColor = "#16A34A";
    }

    if (shipment.shipmentStatus === "approved_by_admin") {
      statusText = "Approved";

      statusBg = "#DBEAFE";

      statusColor = "#2563EB";
    }

    doc.roundedRect(462, currentY + 9, 70, 18, 9).fill(statusBg);

    doc
      .fillColor(statusColor)
      .font("Helvetica-Bold")
      .fontSize(8)
      .text(statusText, 480, currentY + 14);

    /*
    =========================================
    ITEM NAME
    =========================================
    */

    const itemY = currentY + 55;

    doc.roundedRect(55, itemY, 475, 42, 8).fill("#FAF7FF");

    doc
      .fillColor("#666666")
      .font("Helvetica")
      .fontSize(9)
      .text("Item", 75, itemY + 10);

    doc
      .fillColor("#7d3cb5")
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(shipment.selectedItem || "-", 75, itemY + 22);

    /*
    =========================================
    INFO CARDS
    =========================================
    */

    const infoY = currentY + 115;

    const cards = [
      {
        title: "Invoice ID",
        value: shipment.shipmentInvoiceId || "-",
        x: 55,
      },

      {
        title: "Shipped Qty",
        value: `${qty} MT`,
        x: 180,
      },

      {
        title: "Price / MT",
        value: `Rs. ${Number(pricePerMT).toLocaleString()}`,
        x: 305,
      },

      {
        title: "Taxable Amount",
        value: `Rs. ${Number(taxableAmount).toLocaleString()}`,
        x: 430,
      },
    ];

    cards.forEach((card) => {
      doc
        .roundedRect(card.x, infoY, 105, 58, 8)
        .fillAndStroke("#FFFFFF", "#E5E7EB");

      doc
        .fillColor("#777777")
        .font("Helvetica")
        .fontSize(8)
        .text(card.title, card.x + 12, infoY + 14);

      doc
        .fillColor("#222222")
        .font("Helvetica-Bold")
        .fontSize(9)
        .text(card.value, card.x + 12, infoY + 31, {
          width: 80,
        });
    });

    /*
    =========================================
    GST ROW
    =========================================
    */

    const gstY = currentY + 190;

    doc.roundedRect(55, gstY, 475, 45, 8).fill("#FAF7FF");

    doc
      .fillColor("#666666")
      .font("Helvetica")
      .fontSize(9)
      .text("GST Type", 75, gstY + 10);

    doc
      .fillColor("#222222")
      .font("Helvetica-Bold")
      .text(gstLabel, 75, gstY + 24);

    doc
      .fillColor("#666666")
      .font("Helvetica")
      .fontSize(9)
      .text("GST Amount", 255, gstY + 10);

    doc
      .fillColor("#222222")
      .font("Helvetica-Bold")
      .text(`Rs. ${Number(gstAmount).toLocaleString()}`, 255, gstY + 24);

    doc
      .fillColor("#666666")
      .font("Helvetica")
      .fontSize(9)
      .text("Final Amount", 415, gstY + 10);

    doc
      .fillColor("#16A34A")
      .font("Helvetica-Bold")
      .text(`Rs. ${Number(finalAmount).toLocaleString()}`, 415, gstY + 24);

    /*
    =========================================
    WEIGHT TICKET
    =========================================
    */

    const imageY = currentY + 245;

    doc
      .fillColor("#222222")
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("Weight Ticket", 0, imageY, {
        align: "center",
      });

    /*
    =========================================
    IMAGE WRAPPER
    =========================================
    */

    doc.roundedRect(145, imageY + 20, 305, 62, 10).fill("#FAFAFA");

    /*
    =========================================
    IMAGE
    =========================================
    */

    if (shipment.shipmentFile?.data) {
      try {
        const imageBuffer = Buffer.from(shipment.shipmentFile.data);

        doc.image(imageBuffer, 197, imageY + 27, {
          fit: [200, 50],
          align: "center",
          valign: "center",
        });
      } catch (error) {
        doc
          .fillColor("#DC2626")
          .fontSize(9)
          .text("Unable to load image", 225, imageY + 48);
      }
    } else {
      doc
        .fillColor("#777777")
        .fontSize(9)
        .text("No weight ticket uploaded", 215, imageY + 48);
    }

    /*
    =========================================
    NEXT CARD POSITION
    =========================================
    */

    currentY += 340;
  });

  return currentY;
};

export default addShipmentSection;
