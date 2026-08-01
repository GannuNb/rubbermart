import express from "express";
import sendOrderInvoiceEmail from "../utils/sendOrderInvoiceEmail.js";

const router = express.Router();

router.get("/invoice-mail", async (req, res) => {
  try {
    // Dummy PDF buffer (replace with real PDF later if needed)
    const pdfBuffer = Buffer.from("Test PDF");

    await sendOrderInvoiceEmail({
      buyerEmail: "test@example.com",
      buyerName: "Ganesh",
      orderId: "RSM-TEST-0001",
      invoicePdfBuffer: pdfBuffer,
    });

    return res.json({
      success: true,
      message: "Test email sent to Mailtrap.",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;