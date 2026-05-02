// backend/utils/pdf/shipping/generateShippingInvoicePdf.js

import PDFDocument from "pdfkit";

import { drawHeader } from "./sections/header.js";
import { drawCustomerSection } from "./sections/customerSection.js";
import { drawItemsTable } from "./sections/itemsTable.js";
import { drawSummarySection } from "./sections/summarySection.js";
import { drawBankingDetailsSection } from "./sections/bankingDetailsSection.js";
import { drawFooterSection } from "./sections/footerSection.js";

const generateShippingInvoicePdf = async (order, shipment) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 0 });

      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      const pageWidth = 595;
      const pageHeight = 842;

      /* =========================
         BORDER
      ========================= */
      doc.rect(2, 2, pageWidth - 4, pageHeight - 4).stroke();

      /* =========================
         HEADER
      ========================= */
      let y = drawHeader(doc, pageWidth, pageHeight, order, shipment);

      doc.moveTo(35, y).lineTo(pageWidth - 35, y).stroke();
      y += 15;

      /* =========================
         CUSTOMER + SHIPPING
      ========================= */
      y = drawCustomerSection(doc, order, shipment, y);

      /* =========================
         ITEMS (IMPORTANT FIX)
      ========================= */
      const tableResult = drawItemsTable(doc, order, shipment, y);

      y = tableResult.y;

      /* =========================
         SUMMARY (PASS TOTAL)
      ========================= */
      y = drawSummarySection(doc, tableResult.total, y);

      /* =========================
         BANKING
      ========================= */
      y = drawBankingDetailsSection(doc, y);

      /* =========================
         FOOTER
      ========================= */
      drawFooterSection(doc, y);

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

export default generateShippingInvoicePdf;