import { transporter } from "./transporter.js";
import { renderTemplate } from "./renderTemplate.js";

export const sendProductApprovedEmail = async ({
  sellerEmail,
  sellerName,
  productName,
}) => {
  try {
    const html = await renderTemplate(
      "productApproved.ejs",
      {
        sellerName,
        productName,
      }
    );

    await transporter.sendMail({
      from: `"Rubber Scrap Mart" <${process.env.EMAIL_USER}>`,

      to: sellerEmail,

      subject: "Your Product Has Been Approved",

      html,
    });

    console.log("Approved product email sent");
  } catch (error) {
    console.log(
      "Send Product Approved Email Error:",
      error
    );
  }
};