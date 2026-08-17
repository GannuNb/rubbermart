import PDFDocument from "pdfkit";

import { drawHeader } from "./sections/headerSection.js";
import { drawTransporterSection } from "./sections/transporterSection.js";
import { drawSummarySection } from "./sections/summarySection.js";
import { drawShipmentsSection } from "./sections/shipmentsSection.js";
import { drawFooterSection } from "./sections/footerSection.js";

const generateTransporterPaymentReportPdf = async (
  reportData,
) => {
  return new Promise((resolve, reject) => {
    try {
      /*
      ==================================================
      PAGE SIZE
      ==================================================
      */

      const pageWidth = 595;
      const pageHeight = 842;

      /*
      ==================================================
      CONTENT AREA
      ==================================================

      Header + company address finishes around 185-190.

      We intentionally start the main content at 215
      so there is a comfortable gap between:

      Company Address
              ↓
      TRANSPORTER DETAILS
      ==================================================
      */

      const contentTop = 215;

      /*
      ==================================================
      NORMALIZE SHIPMENTS
      ==================================================
      */

      const shipments = Array.isArray(
        reportData?.shipments,
      )
        ? reportData.shipments
        : [];

      /*
      ==================================================
      CALCULATE SUMMARY FROM ACTUAL SHIPMENTS
      ==================================================
      */

      const totalTransportAmount = shipments.reduce(
        (sum, shipment) => {
          return (
            sum +
            Number(
              shipment?.transportAmount || 0,
            )
          );
        },
        0,
      );

      const totalReceived = shipments.reduce(
        (sum, shipment) => {
          return (
            sum +
            Number(
              shipment?.totalReceived || 0,
            )
          );
        },
        0,
      );

      const totalRemaining = shipments.reduce(
        (sum, shipment) => {
          return (
            sum +
            Number(
              shipment?.remainingAmount || 0,
            )
          );
        },
        0,
      );

      /*
      ==================================================
      FINAL REPORT DATA
      ==================================================
      */

      const finalReportData = {
        ...reportData,

        shipments,

        summary: {
          totalTransportAmount,
          totalReceived,
          totalRemaining,
        },
      };

      /*
      ==================================================
      CREATE PDF DOCUMENT
      ==================================================
      */

      const doc = new PDFDocument({
        size: "A4",
        margin: 0,
        autoFirstPage: true,
      });

      const buffers = [];

      /*
      ==================================================
      PDF DATA BUFFER
      ==================================================
      */

      doc.on("data", (chunk) => {
        buffers.push(chunk);
      });

      /*
      ==================================================
      PDF COMPLETE
      ==================================================
      */

      doc.on("end", () => {
        resolve(
          Buffer.concat(buffers),
        );
      });

      /*
      ==================================================
      PDF ERROR
      ==================================================
      */

      doc.on("error", (error) => {
        reject(error);
      });

      /*
      ==================================================
      DRAW COMMON PAGE ELEMENTS
      ==================================================
      */

      const drawPageElements = () => {
        /*
        ----------------------------------------------
        PAGE BORDER
        ----------------------------------------------
        */

        doc
          .save()
          .rect(
            2,
            2,
            pageWidth - 4,
            pageHeight - 4,
          )
          .lineWidth(0.5)
          .stroke("#cccccc")
          .restore();

        /*
        ----------------------------------------------
        HEADER
        ----------------------------------------------
        */

        drawHeader(
          doc,
          pageWidth,
          pageHeight,
          finalReportData,
        );

        /*
        ----------------------------------------------
        FOOTER
        ----------------------------------------------
        */

        drawFooterSection(
          doc,
          pageWidth,
          pageHeight,
        );
      };

      /*
      ==================================================
      FIRST PAGE
      ==================================================
      */

      drawPageElements();

      /*
      ==================================================
      NEW PAGE HANDLER
      ==================================================

      Whenever PDFKit creates a new page, we redraw:

      - page border
      - header
      - footer
      ==================================================
      */

      doc.on("pageAdded", () => {
        drawPageElements();
      });

      /*
      ==================================================
      START NEW PAGE
      ==================================================

      This function is passed to shipment/payment
      sections.

      Those sections can call:

          startNewPage()

      whenever the current page does not have
      enough space.
      ==================================================
      */

      const startNewPage = () => {
        doc.addPage();

        /*
        Header/footer are automatically drawn by
        the "pageAdded" listener above.

        Content starts below the header.
        */

        return contentTop;
      };

      /*
      ==================================================
      PAGE 1 CONTENT
      ==================================================
      */

      let y = contentTop;

      /*
      ==================================================
      TRANSPORTER DETAILS
      ==================================================
      */

      y = drawTransporterSection(
        doc,
        pageWidth,
        y,
        finalReportData,
      );

      /*
      ==================================================
      PAYMENT SUMMARY
      ==================================================
      */

      y = drawSummarySection(
        doc,
        pageWidth,
        y,
        finalReportData,
      );

      /*
      ==================================================
      SHIPMENT PAYMENT DETAILS
      ==================================================
      */

      y = drawShipmentsSection(
        doc,
        pageWidth,
        pageHeight,
        y,
        finalReportData,
        startNewPage,
      );

      /*
      ==================================================
      FINISH PDF
      ==================================================
      */

      doc.end();
    } catch (error) {
      console.error(
        "Generate Transporter Payment Report PDF Error:",
        error,
      );

      reject(error);
    }
  });
};

export default generateTransporterPaymentReportPdf;