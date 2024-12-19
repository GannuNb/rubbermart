const express = require('express');
const router = express.Router();
const multer = require('multer');
const jwt = require('jsonwebtoken');
const Payment = require('../models/Payment');
const AdminOrder = require('../models/AdminOrder');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

// Multer configuration for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware for authentication
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }


  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// File upload route
router.post('/upload', authenticate, upload.single('file'), async (req, res) => {
  try {
    const user = req.user;
    const { orderId } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    // Ensure order ID is correctly handled as a string
    const order = await AdminOrder.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const payment = new Payment({
      file: file.buffer,
      fileName: file.originalname,
      fileType: file.mimetype,
      user: new mongoose.Types.ObjectId(user.id),
      order: order._id, // Custom string-based _id
    });

    await payment.save();

    const fileUrl = `${process.env.REACT_APP_API_URL}/payment/getpayment/${payment._id}`;
    res.status(201).json({
      message: 'File uploaded successfully',
      fileUrl,
      orderId,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error uploading file', error: err.message });
  }
});

// Get all files uploaded by a specific user
router.get('/getfiles', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const payments = await Payment.find({ user: userId }).populate({
      path: 'order',
      populate: {
        path: 'items',
        select: 'name quantity total',
      },
    });

    if (!payments || payments.length === 0) {
      return res.status(404).json({ message: 'No files found for this user' });
    }

    res.status(200).json({
      message: 'Files fetched successfully',
      data: payments,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching files', error: err.message });
  }
});

// Route to fetch a specific payment file
router.get('/getpayment/:paymentId', authenticate, async (req, res) => {
  try {
    const paymentId = req.params.paymentId;

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.setHeader('Content-Type', payment.fileType);
    res.setHeader('Content-Disposition', `attachment; filename=${payment.fileName}`);
    res.send(payment.file);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching payment file', error: err.message });
  }
});

// Get all uploaded files (admin route)
router.get('/getallfiles', authenticate, async (req, res) => {
  try {
    const payments = await Payment.find().populate({
      path: 'order',
      populate: {
        path: 'items',
        select: 'name quantity total',
      },
    }).populate({
      path: 'user',
      select: 'name email',
    });

    if (!payments || payments.length === 0) {
      return res.status(404).json({ message: 'No files found' });
    }

    res.status(200).json({
      message: 'Files fetched successfully',
      data: payments,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching files', error: err.message });
  }
});

// Approve a payment
router.post('/approve/:paymentId', authenticate, async (req, res) => {
  const { approvalNotes } = req.body;
  try {
    const payment = await Payment.findById(req.params.paymentId).populate('user');
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.approval = {
      approved: true,
      approvalDate: new Date(),
      approvalNotes,
    };

    await payment.save();

    const user = payment.user;
    if (!user || !user.email) {
      return res.status(400).json({ message: 'User email not found' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: user.email,
      subject: 'Payment Approval Confirmation for Your Order',
      text: `
        Dear ${user.name},
        
        We are pleased to inform you that your payment for order ID ${payment.order} has been successfully approved. Below are the details for your reference:
        
        Order ID: ${payment.order}
        Approval Notes: ${approvalNotes}
        Approval Date: ${new Date(payment.approval.approvalDate).toLocaleString()}
        
        If you have any questions regarding your payment approval or order, please do not hesitate to contact us at vikahrubber@gmail.com or reply to this email.
        
        Thank you for your continued trust and support.
        
        Best regards,  
        Vikah Rubber
      `,
      attachments: [
        {
          filename: payment.fileName,
          content: payment.file,
          encoding: 'base64',
        }
      ],
};

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Error sending email', error: error.message });
      }
      res.status(200).json({ message: 'Payment approved and email sent successfully' });
    });
  } catch (err) {
    res.status(500).json({ message: 'Error approving payment', error: err.message });
  }
});

module.exports = router;
