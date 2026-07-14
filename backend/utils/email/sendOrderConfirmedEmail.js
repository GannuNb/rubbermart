import { transporter } from "./transporter.js";
import { renderTemplate } from "./renderTemplate.js";

export const sendOrderConfirmedEmail = async ({
  buyerEmail,
  buyerName,
  orderId,
  sellerName,
  totalAmount,
}) => {
  try {
    const html = await renderTemplate("orderConfirmed.ejs", {
      buyerName,
      orderId,
      sellerName,
      totalAmount,
      frontendUrl: process.env.FRONTEND_URL,
    });

    await transporter.sendMail({
      from: `"Rubber Scrap Mart" <${process.env.EMAIL_USER}>`,
      to: buyerEmail,
      subject: `Order ${orderId} Confirmed Successfully`,
      html,
    });

    console.log("Order confirmation email sent:", buyerEmail);
  } catch (error) {
    console.log("Order Confirmation Email Error:", error);
  }
};
