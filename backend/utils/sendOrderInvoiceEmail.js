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
        <div style="
          font-family: Arial, sans-serif;
          background:#f4f7f5;
          padding:40px 20px;
        ">

          <div style="
            max-width:720px;
            margin:auto;
            background:#ffffff;
            border-radius:20px;
            overflow:hidden;
            border:1px solid #dbe5de;
            box-shadow:0 12px 40px rgba(0,0,0,0.08);
          ">

            <!-- HEADER -->

            <div style="
              background:#8751e4;
              padding:28px 36px;
              border-bottom:5px solid #6d3fd4;
            ">

              <div style="
                  text-align:center;
                ">

                  <h1 style="
                    margin:0;
                    color:#ffffff;
                    font-size:28px;
                    font-weight:700;
                    letter-spacing:1px;
                  ">
                    PROFORMA INVOICE
                  </h1>

                </div>


            </div>

            <!-- BODY -->

            <div style="padding:38px;">

              <h2 style="
                color:#111827;
                margin-bottom:22px;
                font-size:24px;
              ">
                Hello ${buyerName},
              </h2>

              <p style="
                color:#475569;
                font-size:15px;
                line-height:1.9;
                margin-bottom:18px;
              ">
                Thank you for placing your order with
                <strong style="color:#111827;">
                  Rubber Scrap Mart
                </strong>.
              </p>

              <p style="
                color:#475569;
                font-size:15px;
                line-height:1.9;
                margin-bottom:18px;
              ">
                Your order has been created successfully and is currently waiting for seller confirmation.
              </p>

              <!-- ORDER BOX -->

              <div style="
                background:#f0fdf4;
                border:1px solid #bbf7d0;
                padding:22px;
                border-radius:16px;
                margin:32px 0;
              ">

                <p style="
                  margin:0;
                  font-size:16px;
                  color:#166534;
                  line-height:1.8;
                ">

                  <strong>
                    Order ID:
                  </strong>

                  ${orderId}

                </p>

              </div>

              <p style="
                color:#475569;
                font-size:15px;
                line-height:1.9;
                margin-bottom:18px;
              ">
                Your invoice PDF has been attached with this email for your records.
              </p>

              <p style="
                color:#475569;
                font-size:15px;
                line-height:1.9;
                margin-bottom:18px;
              ">
                You can upload payment receipt only after seller acceptance.
              </p>

              <!-- INFO BOX -->

              <div style="
                background:#f8fafc;
                border:1px solid #e2e8f0;
                padding:20px;
                border-radius:16px;
                margin-top:34px;
              ">

                <p style="
                  margin:0;
                  color:#334155;
                  font-size:14px;
                  line-height:1.8;
                ">
                  If you have any questions regarding your order,
                  feel free to contact our support team anytime.
                </p>

              </div>

              <!-- FOOTER TEXT -->

              <div style="margin-top:42px;">

                <p style="
                  margin:0;
                  color:#111827;
                  font-weight:700;
                  font-size:15px;
                ">
                  Regards,
                </p>

                <p style="
                  margin-top:10px;
                  color:#475569;
                  font-size:15px;
                ">
                  Rubber Scrap Mart Team
                </p>

              </div>

            </div>

            <!-- FOOTER -->

            <div style="
              background:#f8fafc;
              padding:22px;
              text-align:center;
              border-top:1px solid #e2e8f0;
            ">

              <p style="
                margin:0;
                color:#64748b;
                font-size:13px;
              ">
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
