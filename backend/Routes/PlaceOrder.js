// routes/PlaceOrder.js
const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const router = express.Router();
const jwt = require('jsonwebtoken');
const ScrapItem = require('../models/ScrapItem');
require('dotenv').config();

// Middleware for authentication
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Configure multer for file uploads
const upload = multer();


// Place order route
router.post('/place-order', authenticate, async (req, res) => {
  const { itemName, requiredQuantity } = req.body;

  if (!itemName || !requiredQuantity) {
    return res.status(400).json({ message: 'Item name and required quantity are required.' });
  }

  try {
    const item = await ScrapItem.findOne({ name: itemName });
    if (!item) return res.status(404).json({ message: 'Item not found.' });

    if (item.available_quantity < requiredQuantity) {
      return res.status(400).json({ message: 'Not enough quantity available.' });
    }

    item.available_quantity -= requiredQuantity;
    await item.save();

    res.status(200).json({ message: 'Order placed successfully.', remainingQuantity: item.available_quantity });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'An error occurred while placing the order.' });
  }
});

router.post('/upload-pdf', authenticate, upload.single('pdf'), async (req, res) => {
  const { userEmail } = req.body;
  const pdfFile = req.file;

  if (!userEmail || !pdfFile) {
    return res.status(400).json({ message: 'User email and PDF file are required.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: '📋 Your Order Confirmation from Vikah Rubber',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #1e88e5;">Thank You for Your Order!</h2>
          <p>Dear Customer,</p>
          <p>Thank you for choosing <strong>Vikah Rubber</strong>! We truly appreciate your interest in our products.</p>
          <p>We are pleased to inform you that your order has been successfully processed. Please find the attached order summary PDF for your reference, which includes the details of your purchase.</p>
          <p>If you have any questions or require further assistance, feel free to reach out to us. We are here to help and ensure a smooth experience for you.</p>
          <p style="margin-top: 20px;">Thank you once again for your business, and we look forward to serving you in the future.</p>
          <p style="margin-top: 20px;">Best regards,</p>
          <p><strong>Vikah Rubber</strong></p>
          <div style="margin-top: 20px; padding: 10px; background-color: #f4f4f4; border-radius: 5px;">
            <p><strong>Admin Office:</strong></p>
            <p>#406, 4th Floor, Patel Towers,<br>
               Above EasyBuy, Beside Nagole RTO Office,<br>
               Nagole, Hyderabad, Telangana-500035</p>
            <p><strong>Phone:</strong> +91 4049471616</p>
            <p><strong>Email:</strong> <a href="mailto:vikahrubber@gmail.com" style="color: #1e88e5;">vikahrubber@gmail.com</a></p>
            <p><strong>Website:</strong> <a href="https://vikahrubber.com" style="color: #1e88e5;">https://vikahrubber.com</a></p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: 'order-summary.pdf',
          content: pdfFile.buffer,
        },
      ],
    };
    

    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: '📦 New Order Received: Action Required',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #d32f2f;">New Order Notification</h2>
          <p>Dear Admin,</p>
          <p>A new order has been successfully placed on the system by <strong>${userEmail}</strong>.</p>
          <p><strong>Next Steps:</strong></p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Review the attached order summary for details.</li>
            <li>Ensure the fulfillment process is initiated promptly.</li>
            <li>Contact the customer if additional clarification or action is needed.</li>
          </ul>
          <p>This email serves as a notification for your records and further action. If you have any questions regarding the order, please reply to this email or reach out to the support team.</p>
          <p style="margin-top: 20px;">Best regards,</p>
          <p><strong>Vikah Rubber System</strong></p>
        </div>
      `,
      attachments: [
        {
          filename: 'order-summary.pdf',
          content: pdfFile.buffer,
        },
      ],
    };
    

    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email.' });
  }
});

module.exports = router;
