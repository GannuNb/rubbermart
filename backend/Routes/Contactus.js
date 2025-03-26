const express = require('express');
const nodemailer = require('nodemailer');
const Contact = require('../models/Contactus'); // Import the Contact model

const router = express.Router();

router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Save the contact form submission in the database
    const contact = new Contact({ name, email, message });
    await contact.save();

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 587, // Use port 465 if using SSL
      secure: false, // Use true for SSL (465), false for TLS (587)
      auth: {
        user: process.env.EMAIL_USER, // Full email address (info@rubberscrapmart.com)
        pass: process.env.EMAIL_PASS, // Email password
      },
      tls: {
        rejectUnauthorized: false, // To handle self-signed certificates if needed
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER, // Send from the authenticated email address
      to: process.env.ADMIN_EMAIL,  // Admin email to receive the contact form
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      replyTo: email,  // Reply to the user's email address
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Your message has been sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending message, please try again later.' });
  }
});

module.exports = router;
