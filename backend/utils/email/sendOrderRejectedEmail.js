import { transporter } from "./transporter.js";
import { renderTemplate } from "./renderTemplate.js";

export const sendOrderRejectedEmail = async ({
  buyerEmail,
  buyerName,
  orderId,
  sellerName,
  cancellationReason,
}) => {
  try {
    const html = await renderTemplate("orderRejected.ejs", {
      buyerName,
      orderId,
      sellerName,
      cancellationReason,
      frontendUrl: process.env.FRONTEND_URL,
    });

    await transporter.sendMail({
      from: `"Rubber Scrap Mart" <${process.env.EMAIL_USER}>`,
      to: buyerEmail,
      subject: `Order ${orderId} has been Rejected`,
      html,
    });

    console.log("Order rejection email sent:", buyerEmail);
  } catch (error) {
    console.log("Order Rejection Email Error:", error);
  }
};