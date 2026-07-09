import { invoiceColors } from "../../styles.js";

const { primaryPurple, borderColor, darkText, lightText } = invoiceColors;

export const drawOrderInfoSection = (doc, order, startY) => {
  let y = startY;
  /* =========================
   PENDING BUYER PAYMENTS
========================= */

  const pendingPayments =
    order?.buyerPaymentReceipts?.filter(
      (payment) => payment.status === "pending",
    ) || [];

  /* =========================
   DYNAMIC BOX HEIGHT
========================= */
  /* =========================
   BOX HEIGHT
========================= */

  const baseRowsHeight = 5 * 22; // Order ID, Payment Status, Order Date, Completed, Cancellation

  const cancellationHeight = 28;

  const paymentVerificationTitle = 20;

  const pendingVerificationRow = 22;

  const pendingPaymentsHeight =
    pendingPayments.length > 0 ? 18 + pendingPayments.length * 16 : 0;

  const bottomPadding = 20;

  const infoBoxHeight =
    15 + // top padding
    baseRowsHeight +
    cancellationHeight +
    paymentVerificationTitle +
    pendingVerificationRow +
    pendingPaymentsHeight +
    bottomPadding;

  /* =========================
      SECTION TITLE
  ========================= */

  doc.roundedRect(35, y, 525, 24, 4).fill(primaryPurple);

  doc
    .fillColor("#ffffff")
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("ORDER INFORMATION", 48, y + 7);

  y += 35;

  /* =========================
      BOX
  ========================= */

  doc
    .roundedRect(35, y, 525, infoBoxHeight, 5)
    .lineWidth(0.7)
    .strokeColor(borderColor)
    .stroke();

  const leftLabelX = 50;
  const leftValueX = 170;

  const rightLabelX = 310;
  const rightValueX = 450;

  let rowY = y + 15;

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const drawRow = (leftLabel, leftValue, rightLabel, rightValue, currentY) => {
    doc
      .fillColor(lightText)
      .font("Helvetica-Bold")
      .fontSize(9)
      .text(leftLabel, leftLabelX, currentY);

    doc
      .fillColor(darkText)
      .font("Helvetica")
      .text(leftValue || "-", leftValueX, currentY);

    doc
      .fillColor(lightText)
      .font("Helvetica-Bold")
      .text(rightLabel, rightLabelX, currentY);

    doc
      .fillColor(darkText)
      .font("Helvetica")
      .text(rightValue || "-", rightValueX, currentY);
  };

  drawRow(
    "Order ID",
    order?.orderId,
    "Status",
    order?.orderStatus?.replaceAll("_", " "),
    rowY,
  );

  rowY += 22;

  drawRow(
    "Buyer Payment",
    order?.buyerPaymentStatus,
    "Seller Payment",
    order?.sellerPaymentStatus,
    rowY,
  );

  rowY += 22;

  drawRow(
    "Order Date",
    formatDate(order?.createdAt),
    "Seller Confirmed",
    formatDate(order?.sellerConfirmedAt),
    rowY,
  );

  rowY += 22;

  drawRow(
    "Completed",
    formatDate(order?.completedAt),
    "Cancelled",
    formatDate(order?.cancelledAt),
    rowY,
  );

  rowY += 22;

  /* =========================
   CANCELLATION REASON
========================= */

  doc
    .fillColor(lightText)
    .font("Helvetica-Bold")
    .fontSize(9)
    .text("Cancellation Reason", leftLabelX, rowY);

  doc
    .fillColor(darkText)
    .font("Helvetica")
    .fontSize(9)
    .text(order?.cancellationReason || "-", leftValueX, rowY, {
      width: 340,
    });

  rowY += 28;

  /* =========================
   PAYMENT VERIFICATION
========================= */

  doc
    .fillColor(primaryPurple)
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("PAYMENT VERIFICATION SUMMARY", 50, rowY);

  rowY += 20;

  doc
    .fillColor(lightText)
    .font("Helvetica-Bold")
    .fontSize(9)
    .text("Buyer Payment Verification", 50, rowY);

  doc
    .fillColor(darkText)
    .font("Helvetica")
    .fontSize(9)
    .text(
      pendingPayments.length > 0
        ? `Yes (${pendingPayments.length} Payment${pendingPayments.length > 1 ? "s" : ""})`
        : "No",
      170,
      rowY,
    );

  rowY += 22;

  /* =========================
   PENDING PAYMENTS
========================= */

  if (pendingPayments.length > 0) {
    doc
      .fillColor(lightText)
      .font("Helvetica-Bold")
      .fontSize(9)
      .text("Awaiting Verification", 50, rowY);

    rowY += 18;

    pendingPayments.forEach((payment) => {
      doc
        .fillColor(darkText)
        .font("Helvetica")
        .fontSize(8.5)
        .text(
          `• ₹ ${Number(payment.amount || 0).toLocaleString("en-IN")} | Uploaded : ${formatDate(
            payment.uploadedAt,
          )}`,
          65,
          rowY,
        );

      rowY += 16;
    });
  }

  /* =========================
   BUYER TRANSPORT PAYMENT
========================= */

/* =========================
   BUYER → ADMIN STATUS
========================= */

const buyerTransportStatus = order?.shipments?.every(
  (shipment) => shipment.transportPaymentStatus === "paid"
)
  ? "Payment Verified"
  : order?.shipments?.some(
      (shipment) =>
        shipment.transportPaymentStatus === "partial_paid"
    )
    ? "Partial Payment"
    : order?.shipments?.some(
        (shipment) =>
          shipment.transportPaymentStatus === "payment_submitted"
      )
      ? "Payment Under Verification"
      : order?.shipments?.some(
          (shipment) =>
            shipment.transportPaymentStatus === "payment_rejected"
        )
        ? "Payment Rejected"
        : "Payment Pending";

/* =========================
   ADMIN → TRANSPORTER STATUS
========================= */

const transporterPaymentStatus = order?.shipments?.every((shipment) => {
  const receipts = shipment.adminTransportPaymentReceipts || [];

  if (receipts.length === 0) return false;

  return receipts.every(
    (receipt) => receipt.status === "verified"
  );
})
  ? "Payment Completed"
  : order?.shipments?.some((shipment) => {
      const receipts = shipment.adminTransportPaymentReceipts || [];

      return receipts.some(
        (receipt) => receipt.status === "pending"
      );
    })
    ? "Payment Under Verification"
    : order?.shipments?.some((shipment) => {
        const receipts = shipment.adminTransportPaymentReceipts || [];

        return receipts.length > 0;
      })
      ? "Partial Payment"
      : "Payment Pending";

  /* =========================
   TRANSPORT PAYMENT STATUS
========================= */

  const transportX = 310;
  const transportValueX = 455;

  let transportY = y + 125;

  doc
    .fillColor(primaryPurple)
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("TRANSPORT PAYMENT STATUS", transportX, transportY);

  transportY += 20;

  doc
    .fillColor(lightText)
    .font("Helvetica-Bold")
    .fontSize(9)
    .text("Buyer to Admin", transportX, transportY);

  doc
    .fillColor(darkText)
    .font("Helvetica")
    .fontSize(9)
    .text(
  buyerTransportStatus,
      transportValueX,
      transportY,
      {
        width: 90,
      },
    );

  transportY += 20;

  doc
    .fillColor(lightText)
    .font("Helvetica-Bold")
    .fontSize(9)
    .text("Admin to Transporter", transportX, transportY);

  doc
    .fillColor(darkText)
    .font("Helvetica")
    .fontSize(9)
    .text(transporterPaymentStatus, transportValueX, transportY, {
      width: 90,
    });

  y = rowY + 20;

  return y + 20;
};
