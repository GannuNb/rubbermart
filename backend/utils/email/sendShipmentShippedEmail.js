import { transporter } from "./transporter.js";
import { renderTemplate } from "./renderTemplate.js";

export const sendShipmentShippedEmail = async ({
  buyerEmail,
  buyerName,
  orderId,
  shipmentInvoiceId,
  productName,
  shippedQuantity,
  shipmentFrom,
  shipmentTo,
  transporterName,
}) => {
  try {
    const html = await renderTemplate("shipmentShipped.ejs", {
      buyerName,
      orderId,
      shipmentInvoiceId,
      productName,
      shippedQuantity,
      shipmentFrom,
      shipmentTo,
      transporterName,
      frontendUrl: process.env.FRONTEND_URL,
    });

    await transporter.sendMail({
      from: `"Rubber Scrap Mart" <${process.env.EMAIL_USER}>`,
      to: buyerEmail,
      subject: `🚚 Your Shipment Has Been Dispatched`,
      html,
    });

    console.log(`Shipment shipped email sent to ${buyerEmail}`);
  } catch (error) {
    console.log("Shipment Shipped Email Error:", error);
  }
};