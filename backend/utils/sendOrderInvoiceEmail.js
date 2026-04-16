// backend/utils/sendOrderInvoiceEmail.js

import nodemailer from "nodemailer";

const sendOrderInvoiceEmail = async ({
  buyerEmail,
  buyerName,
  orderId,
  invoicePdfBuffer,
}) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Rubber Scrap Mart" <${process.env.EMAIL_USER}>`,
      to: buyerEmail,
      subject: `Your Order Invoice - ${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; background:#f8fafc; padding:30px;">
          <div style="max-width:700px; margin:auto; background:#ffffff; border-radius:16px; overflow:hidden; border:1px solid #e2e8f0; box-shadow:0 10px 30px rgba(0,0,0,0.08);">
            
            <div style="background:#0f172a; padding:30px; text-align:center;">
              <h1 style="color:#ffffff; margin:0; font-size:30px; font-weight:700;">
                Rubber Scrap Mart
              </h1>

              <p style="color:#cbd5e1; margin-top:10px; font-size:14px;">
                Professional Order Invoice
              </p>
            </div>

            <div style="padding:35px;">
              <h2 style="color:#0f172a; margin-bottom:20px; font-size:22px;">
                Hello ${buyerName},
              </h2>

              <p style="color:#475569; font-size:15px; line-height:1.8; margin-bottom:16px;">
                Thank you for placing your order with Rubber Scrap Mart.
              </p>

              <p style="color:#475569; font-size:15px; line-height:1.8; margin-bottom:16px;">
                Your order has been created successfully and is currently under seller review.
              </p>

              <div style="background:#eff6ff; border:1px solid #bfdbfe; padding:20px; border-radius:14px; margin:30px 0;">
                <p style="margin:0; font-size:15px; color:#1e3a8a; line-height:1.8;">
                  <strong>Order ID:</strong> ${orderId}
                </p>
              </div>

              <p style="color:#475569; font-size:15px; line-height:1.8; margin-bottom:16px;">
                Please find your invoice PDF attached with this email.
              </p>

              <p style="color:#475569; font-size:15px; line-height:1.8; margin-bottom:16px;">
                You can upload payment receipt only after seller confirms your order.
              </p>

              <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:18px; border-radius:14px; margin-top:30px;">
                <p style="margin:0; color:#0f172a; font-size:14px; line-height:1.8;">
                  If you have any questions regarding your order, please contact our support team.
                </p>
              </div>

              <div style="margin-top:40px;">
                <p style="margin:0; color:#0f172a; font-weight:600; font-size:15px;">
                  Regards,
                </p>

                <p style="margin-top:8px; color:#475569; font-size:15px;">
                  Rubber Scrap Mart Team
                </p>
              </div>
            </div>

            <div style="background:#f1f5f9; padding:20px; text-align:center; border-top:1px solid #e2e8f0;">
              <p style="margin:0; color:#64748b; font-size:13px;">
                © Rubber Scrap Mart. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `${orderId}.pdf`,
          content: invoicePdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    console.log(`Invoice email sent successfully to ${buyerEmail}`);
  } catch (error) {
    console.log("Send Order Invoice Email Error:", error);
    throw error;
  }
};

export default sendOrderInvoiceEmail;