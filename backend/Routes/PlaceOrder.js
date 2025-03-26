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

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});




router.post('/upload-pdf', authenticate, upload.single('pdf'), async (req, res) => {
  const { userEmail } = req.body;
  const pdfFile = req.file;

  if (!userEmail || !pdfFile) {
    return res.status(400).json({ message: 'User email and PDF file are required.' });
  }

  try {
    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS,
    //   },
    //   tls: {
    //     rejectUnauthorized: false,
    //   },
    // });
     const transporter = nodemailer.createTransport({
          host: 'smtp.hostinger.com',
          port: 587, // Use port 465 if using SSL
          secure: false, // Use true for SSL (465), false for TLS (587)
          auth: {
            user: process.env.EMAIL_USER, // Full email address
            pass: process.env.EMAIL_PASS, // Email password
          },
          tls: {
            rejectUnauthorized: false, // To handle self-signed certificates if needed
          },
        });

    const mailOptions = {
      from: '"Rubberscrapmart" <' + process.env.EMAIL_USER + '>',  
      to: userEmail,
      subject: '📋 Your Order Confirmation from Rubberscrapmart',
      html: `
        <div style="font-family: 'Arial', sans-serif; color: #333333; padding: 20px; background-color: #f4f4f4; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1e88e5; font-size: 24px; margin-bottom: 20px;">Thank You for Your Order!</h2>
            <p style="font-size: 16px; margin-bottom: 20px;">Dear Customer,</p>
            <p style="font-size: 16px; margin-bottom: 20px;">Thank you for choosing <strong><a href="https://rubberscrapmart.com" style="color: #1e88e5;">Rubberscrapmart.com</a></strong>. We truly appreciate your interest in our products.</p>

            <p style="font-size: 16px; margin-bottom: 20px;">We are pleased to inform you that your order has been successfully processed. Please find the attached order summary PDF for your reference, which includes the details of your purchase.</p>
            <p style="font-size: 16px; margin-bottom: 30px;">If you have any questions or require further assistance, feel free to reach out to us. We are here to help and ensure a smooth experience for you.</p>
            <div style="margin-top: 30px; border-top: 2px solid #1e88e5; padding-top: 20px;">
             
              <p style="font-size: 16px; margin-bottom: 10px;">Best regards,</p>
              <p style="font-size: 16px; margin-bottom: 10px;"><strong><a href="https://rubberscrapmart.com" style="color: #1e88e5;">Rubberscrapmart.com</a></strong></p>
            </div>
            <div style="margin-top: 40px; padding: 20px; background-color: #f9f9f9; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
              <p style="font-size: 16px; margin-bottom: 10px;"><strong>Admin Office:</strong></p>
              <p style="font-size: 14px; margin-bottom: 10px;">Ground Floor, Office No-52/ Plot No-44, Sai Chamber CHS Wing A, Sector -11,Sai Chambers, CBD Belapur, Navi Mumbai, Thane, Maharashtra, 400614,GSTN:27AAVFV4635R1ZY</p>
              <p style="font-size: 14px; margin-bottom: 10px;"><strong>Tel:</strong>040-49511293</p>
              <p style="font-size: 14px; margin-bottom: 10px;"><strong>Email:</strong> <a href="mailto:info@rubberscrapmart.com" style="color: #1e88e5;">info@rubberscrapmart.com</a></p>
            </div>
            <div style="border-left: 5px solid #d32f2f; padding-left: 20px; margin-top: 30px; margin-bottom: 30px;">
              <p style="font-size: 16px; margin-bottom: 10px;"><strong>Note:</strong></p>
              <ul style="font-size: 16px; list-style-type: disc; padding-left: 40px;">
                <li> Please refer to the banking details in the attached PDF to make the payment.</li>
                <li>After making the payment, please upload the payment proof on your orders page by uploading any file as proof,<strong>Website:</strong> <a href="https://rubberscrapmart.com/Getorders" style="color: #1e88e5;">https://rubberscrapmart.com/Getorders</a></li>
                <li>For more details about your order ID, please check your orders page,<strong>Website:</strong> <a href="https://rubberscrapmart.com/Getorders" style="color: #1e88e5;">https://rubberscrapmart.com/Getorders</a></li>
                
              </ul>
            </div>
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
        <div style="font-family: 'Arial', sans-serif; color: #333333; padding: 20px; background-color: #f4f4f4; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #d32f2f; font-size: 24px; margin-bottom: 20px;">New Order Received</h2>
            <p style="font-size: 16px; margin-bottom: 20px;">A new order has been placed by <strong>${userEmail}</strong>.</p>
            <div style="border-left: 5px solid #d32f2f; padding-left: 20px; margin-top: 30px; margin-bottom: 30px;">
              <p style="font-size: 16px; margin-bottom: 10px;"><strong>Action Required:</strong></p>
              <ul style="font-size: 16px; list-style-type: disc; padding-left: 40px;">
                <li>Review the attached order summary.</li>
                
              </ul>
            </div>
            <p style="font-size: 16px; margin-bottom: 20px;">For more details, refer to the attached order summary.</p>
           
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
    

    // Send emails to both customer and admin
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email sent successfully.' });
  } catch (error) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size exceeds the 5MB limit.' });
    }
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email.' });
  }
});


module.exports = router;
