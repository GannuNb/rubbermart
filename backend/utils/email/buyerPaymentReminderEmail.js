import { transporter } from "./transporter.js";
import { renderTemplate } from "./renderTemplate.js";

export const sendBuyerPaymentReminderEmail = async ({
  buyerEmail,
  buyerName,
  orderId,
  totalAmount,
  buyerPaidAmount,
  buyerPendingAmount,
}) => {
  try {
    const html = await renderTemplate("buyerPaymentReminder.ejs", {
      buyerName,
      orderId,
      totalAmount,
      paidAmount: buyerPaidAmount,
      pendingAmount: buyerPendingAmount,
      frontendUrl: process.env.FRONTEND_URL,
    });

    await transporter.sendMail({
      from: `"Rubber Scrap Mart" <${process.env.EMAIL_USER}>`,
      to: buyerEmail,
      subject: `Payment Reminder – Order ${orderId}`,
      html,
    });

    console.log(
      "Buyer payment reminder email sent:",
      buyerEmail,
    );
  } catch (error) {
    console.log(
      "Buyer Payment Reminder Email Error:",
      error,
    );
  }
};