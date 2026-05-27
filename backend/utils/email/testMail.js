import { transporter } from "./transporter.js";

export const sendTestMail = async () => {
  try {
    const info = await transporter.sendMail({
      from: `"Rubber Scrap Mart" <${process.env.EMAIL_USER}>`,

      to: process.env.EMAIL_USER,

      subject: "Test Email",

      html: `
        <h2>Mail Working Successfully ✅</h2>
        <p>Your Nodemailer + Hostinger SMTP setup is working.</p>
      `,
    });

    console.log("Mail sent:", info.messageId);
  } catch (error) {
    console.log("Mail Error:", error);
  }
};