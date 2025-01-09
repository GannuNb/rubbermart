const express = require('express');
const router = express.Router();
const multer = require('multer');
const jwt = require('jsonwebtoken');
const Payment = require('../models/Payment');
const AdminOrder = require('../models/AdminOrder');
const mongoose = require('mongoose');

// File System and Path
const path = require('path');
const fs = require('fs');

// Multer configuration for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/* ----------------------------- Middleware ----------------------------- */

// Authentication Middleware (For customer routes only)
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

/* --------------------------- Customer Routes --------------------------- */

/**
 * @route POST /payment/upload
 * @desc Upload a payment file (Customer)
 */
router.post('/upload', authenticate, upload.single('file'), async (req, res) => {
  try {
    const user = req.user;
    const { orderId } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    const order = await AdminOrder.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    let payment = await Payment.findOne({ order: orderId, user: user.id });
    if (!payment) {
      payment = new Payment({
        user: user.id,
        order: orderId,
        files: [],
      });
    }

    payment.files.push({
      file: file.buffer,
      fileName: file.originalname,
      fileType: file.mimetype,
    });

    await payment.save();

    res.status(201).json({
      message: 'File uploaded successfully',
      paymentId: payment._id,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error uploading file', error: err.message });
  }
});

/**
 * @route GET /payment/getfiles
 * @desc Get all payment files for a user (Customer)
 */
// Update the route that fetches payment files and approval details
router.get('/getfiles', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const payments = await Payment.find({ user: userId }).populate({
      path: 'order',
      select: '_id items',
      populate: { path: 'items', select: 'name quantity total' },
    });

    if (!payments || payments.length === 0) {
      return res.status(404).json({ message: 'No files found for this user' });
    }

    const formattedPayments = payments.map((payment) => ({
      ...payment.toObject(),
      files: payment.files.map((file) => ({
        _id: file._id,
        fileName: file.fileName || 'Unknown File',
        fileType: file.fileType,
      })),
      order: payment.order
        ? { _id: payment.order._id, items: payment.order.items || [] }
        : null,
      approval: payment.approval.map((approvalItem) => ({
        approved: approvalItem.approved,
        approvalDate: approvalItem.approvalDate,
        approvalNotes: approvalItem.approvalNotes,
        amountPaid: approvalItem.amountPaid,
      })),
    }));

    res.status(200).json({
      message: 'Files fetched successfully',
      data: formattedPayments,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching files', error: err.message });
  }
});




router.get('/getpayment/:paymentId/:fileId', async (req, res) => {
  try {
    const { paymentId, fileId } = req.params;

    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    const file = payment.files.id(fileId);
    if (!file) return res.status(404).json({ message: 'File not found' });

    res.setHeader('Content-Type', file.fileType);
    res.setHeader('Content-Disposition', `attachment; filename="${file.fileName}"`);
    res.send(file.file);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching payment file', error: err.message });
  }
});







/* --------------------------- Admin Routes --------------------------- */

/**
 * @route GET /payment/getallfiles
 * @desc Get all payment files grouped by order (Admin)
 */
// Admin route to fetch all payment files for admin users
// Route to get all payment files (No authentication needed)

router.get('/getallfiles', async (req, res) => {
  try {
    // Fetch payments and populate related data for order and user
    const payments = await Payment.find()
      .populate({
        path: 'order',
        populate: { path: 'items', select: 'name quantity total' }, // Populating items in the order
      })
      .populate({ path: 'user', select: 'name email businessProfiles' }); // Populating user details

    // Check if no payments are found
    if (!payments || payments.length === 0) {
      return res.status(404).json({ message: 'No files found' });
    }

    // Transform payments data to ensure `paid` is a valid number
    const paymentsWithPaid = payments.map((payment) => {
      return {
        ...payment.toObject(), // Convert Mongoose document to plain object
        paid: parseFloat(payment.paid) || 0, // Ensure `paid` is a valid number, fallback to 0 if invalid
        user: {
          ...payment.user.toObject(),
          businessProfiles: payment.user.businessProfiles || [], // Default to an empty array if no businessProfiles exist
        },
      };
    });

    // Respond with the transformed data
    res.status(200).json({
      message: 'Files fetched successfully',
      data: paymentsWithPaid, // Send the modified array
    });
  } catch (err) {
    // Log and respond with error details
    console.error('Error fetching files:', err);
    res.status(500).json({ message: 'Error fetching files', error: err.message });
  }
});





/**
 * @route GET /payment/getpayment/:paymentId/:fileId
 * @desc Download a specific payment file (Admin)
 */
router.get('/getpayment/:paymentId/:fileId', async (req, res) => {
  try {
    const { paymentId, fileId } = req.params;

    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    const file = payment.files.id(fileId);
    if (!file) return res.status(404).json({ message: 'File not found' });

    res.setHeader('Content-Type', file.fileType);
    res.setHeader('Content-Disposition', `attachment; filename="${file.fileName}"`);
    res.send(file.file);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching payment file', error: err.message });
  }
});





const nodemailer = require('nodemailer');

router.post('/approve/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { approvalNotes, additionalPaid } = req.body;

  try {
    // Find the payment for the given order, and ensure 'order' is populated with 'items'
    const payment = await Payment.findOne({ order: orderId }).populate({
      path: 'order',
      populate: { path: 'items' }, // Ensure items are populated
    }).populate('user'); // Ensure the user is populated

    if (!payment || !payment.order || !payment.order.items) {
      return res.status(404).json({ message: 'Payment or order not found' });
    }

    const currentPaid = parseFloat(payment.paid) || 0;
    const additionalPaidAmount = parseFloat(additionalPaid || 0);
    const updatedPaid = currentPaid + additionalPaidAmount;

    // Update the payment's approval details
    payment.approval.push({
      approvalNotes: approvalNotes,
      approvalDate: new Date(), // Store the approval date
      amountPaid: additionalPaidAmount, // Store the amount paid
    });
    payment.paid = updatedPaid.toFixed(2); // Update the paid amount

    await payment.save();

    // Calculate the total order price and ensure items exist
    const totalOrderPrice = payment.order.items.reduce((sum, item) => sum + item.total, 0);
    const remainingAmount = totalOrderPrice - updatedPaid;

    // Prepare email content
    const approvalDetails = {
      notes: approvalNotes,
      amountPaid: additionalPaidAmount,
      totalPaid: updatedPaid,
      remainingAmount: remainingAmount,
    };

    // Create the transporter for sending email
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use any service, Gmail for example
      auth: {
        user: process.env.EMAIL_USER, // Replace with your email (e.g., 'your-email@gmail.com')
        pass: process.env.EMAIL_PASS, // Replace with your email password
      },
    });

// Define the email options
const mailOptions = {
  from: process.env.EMAIL_USER, // Sender address
  to: payment.user.email, // Receiver email (user's email from payment data)
  subject: 'Payment Approval Confirmation and Details', // Refined email subject
  text: `
Dear ${payment.user.name},

We are pleased to inform you that your payment has been approved. Below are the details of your payment approval for your reference:

Order ID: ${payment.order._id || 'Not Available'}
Approval Notes: ${approvalDetails.notes}

Amount Received: ₹${approvalDetails.amountPaid.toFixed(2)}
Total Paid to Date: ₹${approvalDetails.totalPaid.toFixed(2)}
Remaining Amount: ₹${approvalDetails.remainingAmount.toFixed(2)}

Thank you for choosing to work with Vikah Rubbers. Your trust and support mean a lot to us, and we are committed to providing you with the best service possible.  

If you have any questions or require further assistance, please do not hesitate to contact us.  

Thank you once again for your cooperation.  

Best regards,  
The Vikah Rubbers Team  

---  
Admin Office:  
#406, 4th Floor, Patel Towers,  
Above EasyBuy, Beside Nagole RTO Office,  
Nagole, Hyderabad, Telangana-500035  

Phone: +91 4049471616  
Email: vikahrubber@gmail.com  
Website: https://rubberscrapmart.com/
`,
};


    // Send the email
    await transporter.sendMail(mailOptions);

    // Respond with success message
    res.status(200).json({
      message: 'Payment approved and email sent successfully',
      updatedPaid, // Return the updated paid amount
    });
  } catch (err) {
    console.error('Error approving payment:', err);
    res.status(500).json({ message: 'Error approving payment', error: err.message });
  }
});










module.exports = router;
