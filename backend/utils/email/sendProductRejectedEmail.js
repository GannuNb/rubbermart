import { transporter } from "./transporter.js";
import { renderTemplate } from "./renderTemplate.js";

export const sendProductRejectedEmail = async ({
  sellerEmail,
  sellerName,
  productName,
}) => {
  try {
    const html = await renderTemplate(
      "productRejected.ejs",
      {
        sellerName,
        productName,
      }
    );

    await transporter.sendMail({
      from: `"Rubber Scrap Mart" <${process.env.EMAIL_USER}>`,

      to: sellerEmail,

      subject: "Your Product Has Been Rejected",

      html,
    });

    console.log("Rejected product email sent");
  } catch (error) {
    console.log(
      "Send Product Rejected Email Error:",
      error
    );
  }
};