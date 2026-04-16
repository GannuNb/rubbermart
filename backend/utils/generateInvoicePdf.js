// backend/utils/generateInvoicePdf.js

import PDFDocument from "pdfkit";

const generateInvoicePdf = async (order) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margin: 40,
        size: "A4",
      });

      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));

      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Header
      doc
        .fillColor("#0f172a")
        .fontSize(24)
        .font("Helvetica-Bold")
        .text("Rubber Scrap Mart", 40, 40);

      doc
        .fillColor("#64748b")
        .fontSize(11)
        .font("Helvetica")
        .text("Professional Order Invoice", 40, 70);

      // Invoice Status Box
      doc
        .roundedRect(400, 40, 150, 55, 10)
        .fillAndStroke("#eff6ff", "#bfdbfe");

      doc
        .fillColor("#2563eb")
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("ORDER STATUS", 420, 52);

      doc
        .fillColor("#0f172a")
        .fontSize(14)
        .font("Helvetica-Bold")
        .text(order.orderStatus?.toUpperCase() || "PENDING", 425, 72);

      // Divider
      doc
        .moveTo(40, 120)
        .lineTo(555, 120)
        .strokeColor("#dbeafe")
        .lineWidth(1)
        .stroke();

      // Order Details
      doc
        .fillColor("#0f172a")
        .fontSize(12)
        .font("Helvetica-Bold")
        .text(`Order ID: ${order.orderId}`, 40, 140);

      doc
        .font("Helvetica")
        .fontSize(11)
        .fillColor("#475569")
        .text(
          `Order Date: ${new Date(order.createdAt).toLocaleDateString(
            "en-IN"
          )}`,
          40,
          160
        );

      // Buyer Section
      doc
        .roundedRect(40, 200, 240, 130, 10)
        .fillAndStroke("#f8fafc", "#e2e8f0");

      doc
        .fillColor("#0f172a")
        .fontSize(13)
        .font("Helvetica-Bold")
        .text("Buyer Details", 55, 215);

      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor("#334155")
        .text(`Name: ${order.shippingAddress?.fullName || "-"}`, 55, 240)
        .text(
          `Mobile: ${order.shippingAddress?.mobileNumber || "-"}`,
          55,
          258
        )
        .text(
          `Address: ${order.shippingAddress?.fullAddress || "-"}`,
          55,
          276,
          {
            width: 210,
          }
        );

      // Seller Section
      doc
        .roundedRect(315, 200, 240, 130, 10)
        .fillAndStroke("#f8fafc", "#e2e8f0");

      doc
        .fillColor("#0f172a")
        .fontSize(13)
        .font("Helvetica-Bold")
        .text("Seller Details", 330, 215);

      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor("#334155")
        .text(
          `Company: ${
            order.seller?.businessProfile?.companyName || "Not Available"
          }`,
          330,
          240,
          {
            width: 200,
          }
        )
        .text(
          `Company ID: ${
            order.seller?.businessProfile?.companyId || "Not Available"
          }`,
          330,
          275,
          {
            width: 200,
          }
        );

      // Products Title
      doc
        .fillColor("#0f172a")
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("Ordered Products", 40, 360);

      // Table Header
      const tableTop = 390;

      doc
        .roundedRect(40, tableTop, 515, 28, 4)
        .fill("#1e293b");

      doc
        .fillColor("#ffffff")
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("Product", 50, tableTop + 9)
        .text("Qty", 250, tableTop + 9)
        .text("Price/MT", 310, tableTop + 9)
        .text("Subtotal", 430, tableTop + 9);

      let rowY = tableTop + 38;

      order.orderItems.forEach((item, index) => {
        doc
          .roundedRect(40, rowY - 6, 515, 32, 4)
          .fill(index % 2 === 0 ? "#f8fafc" : "#ffffff");

        doc
          .fillColor("#0f172a")
          .font("Helvetica")
          .fontSize(10)
          .text(item.application || "-", 50, rowY)
          .text(`${item.requiredQuantity} MT`, 250, rowY)
          .text(`₹${item.pricePerMT}`, 310, rowY)
          .text(`₹${item.subtotal}`, 430, rowY);

        rowY += 35;
      });

      // Totals Section
      const totalsTop = rowY + 25;

      doc
        .roundedRect(330, totalsTop, 225, 100, 10)
        .fillAndStroke("#eff6ff", "#bfdbfe");

      doc
        .fillColor("#334155")
        .fontSize(11)
        .font("Helvetica")
        .text("Taxable Amount", 345, totalsTop + 18)
        .text(`₹${order.taxableAmount}`, 470, totalsTop + 18);

      doc
        .text("GST Amount", 345, totalsTop + 42)
        .text(`₹${order.gstAmount}`, 470, totalsTop + 42);

      doc
        .moveTo(345, totalsTop + 68)
        .lineTo(535, totalsTop + 68)
        .strokeColor("#94a3b8")
        .stroke();

      doc
        .fillColor("#0f172a")
        .font("Helvetica-Bold")
        .fontSize(13)
        .text("Grand Total", 345, totalsTop + 78)
        .text(`₹${order.totalAmount}`, 470, totalsTop + 78);

      // Footer
      doc
        .fillColor("#64748b")
        .fontSize(9)
        .font("Helvetica")
        .text(
          "Thank you for ordering with Rubber Scrap Mart.",
          40,
          760,
          {
            align: "center",
            width: 515,
          }
        );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

export default generateInvoicePdf;