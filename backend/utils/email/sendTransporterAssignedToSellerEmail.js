import { transporter } from "./transporter.js";
import { renderTemplate } from "./renderTemplate.js";

export const sendTransporterAssignedToSellerEmail = async ({
  sellerEmail,
  sellerName,
  orderId,
  shipmentInvoiceId,
  transporterName,
  productName,
  shipmentFrom,
  shipmentTo,
  transportPrice,
  estimatedDeliveryDays,
}) => {
  try {
    const html = await renderTemplate(
      "transporterAssignedToSeller.ejs",
      {
        sellerName,
        orderId,
        shipmentInvoiceId,
        transporterName,
        productName,
        shipmentFrom,
        shipmentTo,
        transportPrice,
        estimatedDeliveryDays,
        frontendUrl: process.env.FRONTEND_URL,
      },
    );

    await transporter.sendMail({
      from: `"Rubber Scrap Mart" <${process.env.EMAIL_USER}>`,
      to: sellerEmail,
      subject: `Transporter Assigned - Order ${orderId}`,
      html,
    });

    console.log(
      "Transporter assignment email sent to seller:",
      sellerEmail,
    );
  } catch (error) {
    console.log(
      "Transporter Assigned Seller Email Error:",
      error,
    );
  }
};