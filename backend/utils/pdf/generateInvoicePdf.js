import PDFDocument from "pdfkit";
import { drawHeader } from "./sections/header.js";
import { drawCustomerSection } from "./sections/customerSection.js";
import { drawItemsTable } from "./sections/itemsTable.js";
import { drawTotalsSection } from "./sections/totalsSection.js";
import { drawSummarySection } from "./sections/summarySection.js";
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

      doc
        .rect(2, 2, pageWidth - 4, pageHeight - 4)
        .stroke();

      drawHeader(doc, pageWidth, pageHeight, order);
      drawCustomerSection(doc, order);

      doc
        .moveTo(30, 190)
        .lineTo(565, 190)
        .stroke();

      let y = drawItemsTable(doc, order);
      y = drawTotalsSection(doc, order, y);
      y = drawSummarySection(doc, order, y);

      drawFooterSection(doc, y);

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

export default generateInvoicePdf;