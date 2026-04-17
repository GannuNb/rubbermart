import PDFDocument from "pdfkit";
import { drawHeader } from "./invoicePdfSections.js";
import { invoiceColors } from "./invoicePdfStyles.js";

const {
  primaryPurple,
  lightPurple,
  darkPurple,
  gold,
  darkText,
  lightText,
  borderColor,
} = invoiceColors;

const generateInvoicePdf = async (order) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 0,
      });

      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));

      doc.on("end", () => {
        resolve(Buffer.concat(buffers));
      });

      const pageWidth = 595;
      const pageHeight = 842;

      doc
        .lineWidth(2)
        .strokeColor("#222222")
        .rect(2, 2, pageWidth - 4, pageHeight - 4)
        .stroke();

      drawHeader(doc, pageWidth, pageHeight, order);

      doc
        .moveTo(30, 190)
        .lineTo(565, 190)
        .lineWidth(1)
        .strokeColor(borderColor)
        .stroke();

      doc.rect(72, 200, 120, 24).fill(primaryPurple);

      doc
        .fillColor("#ffffff")
        .font("Helvetica-Bold")
        .fontSize(9)
        .text("Customer", 105, 208);

      doc.rect(375, 200, 120, 24).fill(primaryPurple);

      doc
        .fillColor("#ffffff")
        .font("Helvetica-Bold")
        .fontSize(9)
        .text("Ship To", 415, 208);

      const customerY = 242;

      const buyerCompany =
        order.buyer?.businessProfile?.companyName || "-";

      const buyerPhone =
        order.buyer?.businessProfile?.phoneNumber ||
        order.shippingAddress?.mobileNumber ||
        "-";

      const buyerEmail =
        order.buyer?.businessProfile?.email ||
        order.buyer?.email ||
        "-";

      const buyerGst =
        order.buyer?.businessProfile?.gstNumber ||
        order.buyerGstNumber ||
        "-";

      const customerAddress =
        order.buyer?.businessProfile?.billingAddress ||
        order.buyer?.businessProfile?.shippingAddress ||
        "-";

      const shipToAddress =
        order.shippingAddress?.fullAddress ||
        [
          order.shippingAddress?.flatHouse,
          order.shippingAddress?.areaStreet,
          order.shippingAddress?.landmark,
          order.shippingAddress?.city,
          order.shippingAddress?.state,
          order.shippingAddress?.pincode,
        ]
          .filter(Boolean)
          .join(", ") ||
        "-";

      doc
        .fillColor(darkText)
        .font("Helvetica")
        .fontSize(8)
        .text("Name", 72, customerY)
        .text(":", 135, customerY)
        .text(order.buyer?.fullName || "-", 145, customerY)

        .text("Company", 72, customerY + 20)
        .text(":", 135, customerY + 20)
        .text(buyerCompany, 145, customerY + 20)

        .text("Address", 72, customerY + 40)
        .text(":", 135, customerY + 40)
        .text(customerAddress, 145, customerY + 40, {
          width: 150,
        })

        .text("Phone", 72, customerY + 90)
        .text(":", 135, customerY + 90)
        .text(buyerPhone, 145, customerY + 90)

        .text("E-mail", 72, customerY + 110)
        .text(":", 135, customerY + 110)
        .text(buyerEmail, 145, customerY + 110, {
          width: 140,
        })

        .text("GSTN", 72, customerY + 130)
        .text(":", 135, customerY + 130)
        .text(buyerGst, 145, customerY + 130);

      doc
        .fillColor(darkText)
        .font("Helvetica")
        .fontSize(8)
        .text("Name", 382, customerY)
        .text(":", 445, customerY)
        .text(order.shippingAddress?.fullName || "-", 455, customerY)

        .text("Company", 382, customerY + 20)
        .text(":", 445, customerY + 20)
        .text(buyerCompany, 455, customerY + 20, {
          width: 95,
        })

        .text("Address", 382, customerY + 40)
        .text(":", 445, customerY + 40)
        .text(shipToAddress, 455, customerY + 40, {
          width: 95,
        })

        .text("Phone", 382, customerY + 90)
        .text(":", 445, customerY + 90)
        .text(
          order.shippingAddress?.mobileNumber || buyerPhone,
          455,
          customerY + 90
        )

        .text("E-mail", 382, customerY + 110)
        .text(":", 445, customerY + 110)
        .text(buyerEmail, 455, customerY + 110, {
          width: 95,
        })

        .text("GSTN", 382, customerY + 130)
        .text(":", 445, customerY + 130)
        .text(buyerGst, 455, customerY + 130);

      const tableTop = 390;
      const rowHeight = 34;

      doc.rect(35, tableTop, 525, 22).fill(primaryPurple);

      doc
        .fillColor("#ffffff")
        .font("Helvetica-Bold")
        .fontSize(8)
        .text("S.NO", 42, tableTop + 7)
        .text("Item Name", 82, tableTop + 7)
        .text("Req Qty/MT", 160, tableTop + 7)
        .text("Price/MT", 225, tableTop + 7)
        .text("Subtotal", 285, tableTop + 7)
        .text(
          order.gstType === "cgst_sgst"
            ? "CGST (9%) + SGST (9%)"
            : "IGST (18%)",
          340,
          tableTop + 7,
          {
            width: 95,
            align: "center",
          }
        )
        .text("Total Amount", 450, tableTop + 7);

      let currentY = tableTop + 22;

      order.orderItems.forEach((item, index) => {
        const itemTaxAmount =
          Number(item.gstAmount || 0) > 0
            ? Number(item.gstAmount)
            : Number(item.subtotal || 0) * 0.18;

        const totalRowAmount =
          Number(item.subtotal || 0) + Number(itemTaxAmount || 0);

        doc
          .rect(35, currentY, 525, rowHeight)
          .strokeColor(borderColor)
          .stroke();

        [72, 155, 210, 278, 340, 425].forEach((x) => {
          doc
            .moveTo(x, currentY)
            .lineTo(x, currentY + rowHeight)
            .strokeColor(borderColor)
            .stroke();
        });

        doc
          .fillColor(darkText)
          .font("Helvetica")
          .fontSize(8)
          .text(index + 1, 48, currentY + 10)
          .text(item.application || "-", 80, currentY + 10, {
            width: 70,
          })
          .text(`${item.requiredQuantity}`, 165, currentY + 10)
          .text(Number(item.pricePerMT || 0).toFixed(2), 225, currentY + 10)
          .text(Number(item.subtotal || 0).toFixed(2), 286, currentY + 10)
          .text(itemTaxAmount.toFixed(2), 350, currentY + 10)
          .text(totalRowAmount.toFixed(2), 450, currentY + 10);

        currentY += rowHeight;
      });

      const totalsRowHeight = 80;

      doc
        .rect(35, currentY, 525, totalsRowHeight)
        .strokeColor(borderColor)
        .stroke();

      [72, 155, 210, 278, 340, 425].forEach((x) => {
        doc
          .moveTo(x, currentY)
          .lineTo(x, currentY + totalsRowHeight)
          .strokeColor(borderColor)
          .stroke();
      });

      if (order.gstType === "cgst_sgst") {
        doc
          .fillColor(darkText)
          .font("Helvetica-Bold")
          .fontSize(7)
          .text("Taxable Value", 288, currentY + 24, {
            width: 48,
            align: "center",
          })
          .text(
            `${Number(order.taxableAmount || 0).toFixed(2)}`,
            282,
            currentY + 44,
            {
              width: 60,
              align: "center",
            }
          )

          .text(" Total CGST + SGST ", 348, currentY + 24, {
            width: 70,
            align: "center",
          })
          .text(
            `${Number(order.gstAmount || 0).toFixed(2)}`,
            350,
            currentY + 44,
            {
              width: 60,
              align: "center",
            }
          )

          .fontSize(9)
          .text("Grand Total", 432, currentY + 24, {
            width: 110,
            align: "center",
          })
          .text(
            `${Number(order.totalAmount || 0).toFixed(2)}`,
            432,
            currentY + 44,
            {
              width: 110,
              align: "center",
            }
          );
      } else {
        doc
          .fillColor(darkText)
          .font("Helvetica-Bold")
          .fontSize(7)
          .text("Taxable Value:", 285, currentY + 28)
          .text(
            `${Number(order.taxableAmount || 0).toFixed(2)}`,
            285,
            currentY + 44
          )

          .text("IGST :", 350, currentY + 28)
          .text(
            `${Number(order.igstAmount || 0).toFixed(2)}`,
            350,
            currentY + 44
          )

          .fontSize(10)
          .text("Grand Total :", 445, currentY + 35)
          .text(
            `${Number(order.totalAmount || 0).toFixed(2)}`,
            445,
            currentY + 52
          );
      }

      currentY += totalsRowHeight;

      const summaryTop = currentY + 5;

      const summaryGradient = doc.linearGradient(
        35,
        summaryTop,
        560,
        summaryTop
      );
      summaryGradient.stop(0, darkPurple);
      summaryGradient.stop(0.5, primaryPurple);
      summaryGradient.stop(1, lightPurple);

      doc.rect(35, summaryTop, 525, 70).fill(summaryGradient);

      doc
        .fillColor("#ffffff")
        .font("Helvetica-Bold")
        .fontSize(9)
        .text(
          `Total Amount In words : ${
            order.amountInWords ||
            "Thirty Four Thousand Four Hundred Fifty Six Rupees Only"
          }`,
          60,
          summaryTop + 28,
          {
            width: 430,
          }
        );

      const termsY = summaryTop + 95;

      doc
        .fillColor(darkText)
        .font("Helvetica-Bold")
        .fontSize(10)
        .text("Terms and Conditions :", 35, termsY);

      doc
        .moveTo(35, termsY + 18)
        .lineTo(560, termsY + 18)
        .strokeColor(gold)
        .stroke();

      doc
        .fillColor(lightText)
        .font("Helvetica-Oblique")
        .fontSize(7)
        .text(
          "1. The Seller shall not be liable to the Buyer for any loss or damage.",
          35,
          termsY + 35
        )
        .text(
          "2. The Seller warrants the product for one (1) year from the date of shipment.",
          35,
          termsY + 55
        )
        .text(
          "3. The purchase order will be interpreted as acceptance of this offer.",
          35,
          termsY + 75
        );

      const bottomGradient = doc.linearGradient(35, 772, 560, 772);
      bottomGradient.stop(0, darkPurple);
      bottomGradient.stop(0.5, primaryPurple);
      bottomGradient.stop(1, lightPurple);

      doc.roundedRect(35, 772, 525, 22, 12).fill(bottomGradient);

      doc
        .fillColor("#ffffff")
        .font("Helvetica-Oblique")
        .fontSize(7)
        .text(
          "This is a system-generated proforma invoice and does not require a physical signature.",
          60,
          779,
          {
            width: 470,
            align: "center",
          }
        );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

export default generateInvoicePdf;

