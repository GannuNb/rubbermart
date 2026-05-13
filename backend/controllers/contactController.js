import nodemailer from "nodemailer";

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",

      port: 465,

      secure: true,

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Rubber Scrap Mart" <${process.env.EMAIL_USER}>`,

      to: process.env.ADMIN_EMAIL,

      replyTo: email,

      subject: `Contact Form - ${subject}`,

      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">

          <h2 style="color:#1d4ed8;">
            New Contact Form Message
          </h2>

          <hr style="margin:20px 0;" />

          <p>
            <strong>Name:</strong> ${name}
          </p>

          <p>
            <strong>Email:</strong> ${email}
          </p>

          <p>
            <strong>Subject:</strong> ${subject}
          </p>

          <p>
            <strong>Message:</strong>
          </p>

          <div
            style="
              background:#f5f5f5;
              padding:15px;
              border-radius:10px;
              line-height:1.7;
            "
          >
            ${message}
          </div>

        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.log("Contact Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};
