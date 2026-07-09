import PDFDocument from "pdfkit";

import { drawHeaderSection } from "./sections/headerSection.js";
import { drawOrderInfoSection } from "./sections/orderInfoSection.js";
import { drawBuyerSellerSection } from "./sections/buyerSellerSection.js";
import { drawItemsTableSection } from "./sections/itemsTableSection.js";
import { drawPaymentSummarySection } from "./sections/paymentSummarySection.js";
import { drawPaymentHistorySection } from "./sections/paymentHistorySection.js";
import { drawShipmentSection } from "./sections/shipmentSection.js";
import { drawTimelineSection } from "./sections/timelineSection.js";
import { drawFooterSection } from "./sections/footerSection.js";
import { ensurePageSpace, drawPageBorder } from "./pdfHelpers.js";

const generateOrderHistoryPdf = async (order, shipmentQuotes = []) => {
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

      /* =========================
         PAGE BORDER
      ========================= */

      drawPageBorder(doc);

      let y = 0;

      /* =========================
         HEADER
      ========================= */

      y = drawHeaderSection(doc, pageWidth, pageHeight, order);

      /* =========================
        ORDER INFORMATION
        ========================= */

      y = ensurePageSpace(doc, y, 170);

      y = drawOrderInfoSection(doc, order, y);

      /* =========================
            BUYER & SELLER
            ========================= */

      y = ensurePageSpace(doc, y, 230);

      y = drawBuyerSellerSection(doc, order, y);

      /* =========================
            ORDER ITEMS
            ========================= */

      const itemHeight = (order?.orderItems?.length || 0) * 32 + 80;

      y = ensurePageSpace(doc, y, itemHeight);

      y = drawItemsTableSection(doc, order, y);

      /* =========================
   PAYMENT SUMMARY
========================= */

      y = ensurePageSpace(doc, y, 210);

      y = drawPaymentSummarySection(doc, order, y);

      /* =========================
   PAYMENT HISTORY
========================= */

      const paymentHeight =
        ((order?.buyerPaymentReceipts?.length || 0) +
          (order?.sellerPaymentReceipts?.length || 0)) *
          30 +
        150;

      y = ensurePageSpace(doc, y, paymentHeight);

      y = drawPaymentHistorySection(doc, order, y);

      /* =========================
   SHIPMENTS
========================= */

      const shipmentHeight = (order?.shipments?.length || 0) * 230 + 80;

      y = ensurePageSpace(doc, y, shipmentHeight);

      y = drawShipmentSection(doc, order, shipmentQuotes, y);
      /* =========================
   TIMELINE
========================= */

      y = ensurePageSpace(doc, y, 280);

      y = drawTimelineSection(doc, order, y);

      /* =========================
         FOOTER
      ========================= */

      drawFooterSection(doc, y);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

export default generateOrderHistoryPdf;
