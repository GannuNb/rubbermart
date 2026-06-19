import { transporter } from "./transporter.js";
import { renderTemplate } from "./renderTemplate.js";

export const sendInterestedProductEmail = async ({
  userEmail,
  userName,
  productName,
  productId,
}) => {
  try {
    const productLink = `${process.env.FRONTEND_URL}/product/${productId}`;

    const html = await renderTemplate("interestedProductAdded.ejs", {
      userName,
      productName,
      productLink,
    });

    await transporter.sendMail({
      from: `"Rubber Scrap Mart" <${process.env.EMAIL_USER}>`,

      to: userEmail,

      subject: "New Product Added Matching Your Interest",

      html,
    });

    console.log("Interested product email sent:", userEmail);
  } catch (error) {
    console.log("Interested Product Email Error:", error);
  }
};
