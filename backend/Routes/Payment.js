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

router.get('/getallfiles', authenticate, async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate({
        path: 'order',
        populate: {
          path: 'items',
          select: 'name quantity total',
        },
      })
      .populate({
        path: 'user',
        select: 'name email',
      });

    if (!payments || payments.length === 0) {
      return res.status(404).json({ message: 'No files found' });
    }

    const groupedOrders = payments.reduce((acc, payment) => {
      const orderId = payment.order._id;
      if (!acc[orderId]) {
        acc[orderId] = {
          user: payment.user,
          order: payment.order,
          totalPaid: 0,
          files: [],
        };
      }
      const fileUrl = `${process.env.REACT_APP_API_URL}/payment/getpayment/${payment._id}`;
      acc[orderId].files.push({
        _id: payment._id,
        fileName: payment.fileName,
        fileUrl, // Add file URL for frontend to access
        fileType: payment.fileType,
        paid: parseFloat(payment.paid || 0),
        approval: payment.approval,
      });
      acc[orderId].totalPaid += parseFloat(payment.paid || 0);
      return acc;
    }, {});

    res.status(200).json({
      message: 'Files fetched successfully',
      data: Object.values(groupedOrders),
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching files', error: err.message });
  }
});


router.post('/approve/:paymentId', authenticate, async (req, res) => {
  const { approvalNotes, paid } = req.body;

  try {
    const payment = await Payment.findById(req.params.paymentId).populate('order');
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    const totalOrderPrice = payment.order.items.reduce((sum, item) => sum + item.total, 0);
    const totalPaid = parseFloat(payment.paid || 0) + parseFloat(paid || 0);

    payment.paid = totalPaid; // Update the paid amount for this payment
    payment.approval = {
      approved: totalPaid >= totalOrderPrice, // Fully approve only if fully paid
      approvalDate: new Date(),
      approvalNotes,
    };

    await payment.save();

    // Recalculate total paid amount for the entire order
    const allPayments = await Payment.find({ order: payment.order._id });
    const updatedTotalPaid = allPayments.reduce((sum, p) => sum + parseFloat(p.paid || 0), 0);

    res.status(200).json({
      message: totalPaid >= totalOrderPrice
        ? 'Payment fully paid and approved'
        : 'Partial payment recorded',
      updatedTotalPaid,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error approving payment', error: err.message });
  }
});


module.exports = router;
