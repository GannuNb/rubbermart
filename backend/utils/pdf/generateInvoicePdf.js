import PDFDocument from "pdfkit";
import { drawHeader } from "./sections/header.js";
import { drawCustomerSection } from "./sections/customerSection.js";
import { drawItemsTable } from "./sections/itemsTable.js";
import { drawTotalsSection } from "./sections/totalsSection.js";
import { drawSummarySection } from "./sections/summarySection.js";
import { drawBankingDetailsSection } from "./sections/bankingDetailsSection.js";
import { drawFooterSection } from "./sections/footerSection.js";

const generateInvoicePdf = async (order) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 0 });

      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      const pageWidth = 595;
      const pageHeight = 842;
      doc.rect(2, 2, pageWidth - 4, pageHeight - 4).stroke();

      let y = drawHeader(doc, pageWidth, pageHeight, order);

      doc.moveTo(35, y).lineTo(pageWidth - 35, y).stroke();
      y += 15; // Padding after the line

      y = drawCustomerSection(doc, order, y);

      y = drawItemsTable(doc, order, y);

      y = drawTotalsSection(doc, order, y);
      y = drawSummarySection(doc, order, y);

       /* =========================
         BANKING DETAILS SECTION
      ========================= */

      y = drawBankingDetailsSection(doc, y);


      drawFooterSection(doc, y);

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

export default generateInvoicePdf;