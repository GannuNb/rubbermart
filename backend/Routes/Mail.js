// upload-pdf.js (Express Route)

const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const router = express.Router();

// Multer setup for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Email configuration
// const transporter = nodemailer.createTransport({
//     service: 'gmail', 
//     auth: {
//         user: process.env.EMAIL_USER, 
//         pass: process.env.EMAIL_PASS,
//     },
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

// Route to handle PDF upload and send email
router.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
    const userEmail = req.body.userEmail; // Get user email from request body
    const adminEmail = process.env.ADMIN_EMAIL; // Admin email from environment variable

    // Mail options for the user
    const userMailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Your Order Summary',
        text: 'Please find attached your order summary.',
        attachments: [
            {
                filename: 'order-summary.pdf',
                content: req.file.buffer, // Using buffer from uploaded file
            },
        ],
    };

    // Mail options for the admin
    const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: adminEmail,
        subject: 'New Order Received',
        text: 'A new order has been placed. See attached for details.',
        attachments: [
            {
                filename: 'order-summary.pdf',
                content: req.file.buffer,
            },
        ],
    };

    try {
        // Send email to user
        await transporter.sendMail(userMailOptions);
        // Send email to admin
        await transporter.sendMail(adminMailOptions);
        res.status(200).json({ message: 'Order summary sent to user and admin successfully.' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send emails.' });
    }
});

module.exports = router;
