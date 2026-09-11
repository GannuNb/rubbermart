import { transporter } from "./transporter.js";
import { renderTemplate } from "./renderTemplate.js";

export const sendNewOrderToSellerEmail = async ({
  sellerEmail,
  sellerName,
  orderId,
  totalAmount,
}) => {
  try {
    const html = await renderTemplate("newOrderToSeller.ejs", {
      sellerName,
      orderId,
      totalAmount,
      frontendUrl: process.env.FRONTEND_URL,
    });

    await transporter.sendMail({
      from: `"Rubber Scrap Mart" <${process.env.EMAIL_USER}>`,
      to: sellerEmail,
      subject: `New Order Received - ${orderId}`,
      html,
    });

    console.log("New order email sent to seller:", sellerEmail);
  } catch (error) {
    console.log("New Order Seller Email Error:", error);
  }
};