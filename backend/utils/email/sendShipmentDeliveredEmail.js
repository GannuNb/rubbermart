import { transporter } from "./transporter.js";
import { renderTemplate } from "./renderTemplate.js";

export const sendShipmentDeliveredEmail = async ({
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
    const html = await renderTemplate("shipmentDelivered.ejs", {
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
      subject: "✅ Your Shipment Has Been Delivered",
      html,
    });

    console.log(`Shipment delivered email sent to ${buyerEmail}`);
  } catch (error) {
    console.log("Shipment Delivered Email Error:", error);
  }
};