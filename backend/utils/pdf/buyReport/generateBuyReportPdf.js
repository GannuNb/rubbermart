import PDFDocument from "pdfkit";
import path from "path";

import addHeaderSection from "./sections/headerSection.js";
import addPaymentSummarySection from "./sections/paymentSummarySection.js";
import addShipmentSection from "./sections/shipmentSection.js";
import addFooterSection from "./sections/footerSection.js";

const generateBuyReportPdf = async (order) => {
  return new Promise((resolve, reject) => {
    try {
      /* =========================
         CREATE PDF
      ========================= */

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

      /* =========================
         LOGO
      ========================= */

      const logoPath = path.join(
        process.cwd(),
        "../rubberproject/public/rsm_logo.png"
      );

      /* =========================
         HEADER
      ========================= */

      addHeaderSection(doc, order, logoPath);

      /* =========================
         PAYMENT SUMMARY
      ========================= */

      addPaymentSummarySection(doc, order);

      /* =========================
         SHIPMENTS
      ========================= */

      addShipmentSection(doc, order);

      /* =========================
         FOOTER
      ========================= */

      addFooterSection(doc);

      /* =========================
         END PDF
      ========================= */

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

export default generateBuyReportPdf;