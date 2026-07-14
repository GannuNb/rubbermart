import { transporter } from "./transporter.js";
import { renderTemplate } from "./renderTemplate.js";

export const sendNewShipmentAvailableEmail = async ({
  transporterEmail,
  transporterName,
  orderId,
  shipmentInvoiceId,
  productName,
  shippedQuantity,
  shipmentFrom,
  shipmentTo,
}) => {
  try {
    const html = await renderTemplate("newShipmentAvailable.ejs", {
      transporterName,
      orderId,
      shipmentInvoiceId,
      productName,
      shippedQuantity,
      shipmentFrom,
      shipmentTo,
      frontendUrl: process.env.FRONTEND_URL,
    });

    await transporter.sendMail({
      from: `"Rubber Scrap Mart" <${process.env.EMAIL_USER}>`,
      to: transporterEmail,
      subject: `🚚 New Shipment Available for Quotation`,
      html,
    });

    console.log(
      `Shipment notification sent to transporter: ${transporterEmail}`,
    );
  } catch (error) {
    console.log("New Shipment Email Error:", error);
  }
};