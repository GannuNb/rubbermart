import { transporter } from "./transporter.js";
import { renderTemplate } from "./renderTemplate.js";

export const sendTransporterAssignedEmail = async ({
  transporterEmail,
  transporterName,
  shipmentInvoiceId,
  orderId,
  productName,
  shipmentFrom,
  shipmentTo,
  quotedPrice,
  estimatedDeliveryDays,
}) => {
  try {
    const html = await renderTemplate("transporterAssigned.ejs", {
      transporterName,
      shipmentInvoiceId,
      orderId,
      productName,
      shipmentFrom,
      shipmentTo,
      quotedPrice,
      estimatedDeliveryDays,
      frontendUrl: process.env.FRONTEND_URL,
    });

    await transporter.sendMail({
      from: `"Rubber Scrap Mart" <${process.env.EMAIL_USER}>`,
      to: transporterEmail,
      subject: `🎉 Congratulations! Shipment Assigned`,
      html,
    });

    console.log(
      `Shipment assignment email sent to ${transporterEmail}`,
    );
  } catch (error) {
    console.log("Transporter Assignment Email Error:", error);
  }
};