import { transporter } from "./transporter.js";
import { renderTemplate } from "./renderTemplate.js";

export const sendOrderConfirmedEmail = async ({
  buyerEmail,
  buyerName,
  orderId,
  sellerCompanyId,
  totalAmount,
}) => {
  try {
    const html = await renderTemplate("orderConfirmed.ejs", {
      buyerName,
      orderId,
      sellerCompanyId,
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
