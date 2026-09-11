import { transporter } from "./transporter.js";
import { renderTemplate } from "./renderTemplate.js";

export const sendBuyerPaymentUploadedToAdminEmail = async ({
  adminEmail,
  adminName,
  buyerName,
  orderId,
  amount,
  paymentMode,
  transactionId,
}) => {
  try {
    const html = await renderTemplate(
      "buyerPaymentUploadedToAdmin.ejs",
      {
        adminName,
        buyerName,
        orderId,
        amount,
        paymentMode,
        transactionId,
        frontendUrl: process.env.FRONTEND_URL,
      },
    );

    await transporter.sendMail({
      from: `"Rubber Scrap Mart" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `Payment Received - Verification Required - Order ${orderId}`,
      html,
    });

    console.log(
      "Buyer payment notification sent to admin:",
      adminEmail,
    );
  } catch (error) {
    console.log(
      "Buyer Payment Admin Email Error:",
      error,
    );
  }
};