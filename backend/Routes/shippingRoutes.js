const express = require('express');
const jwt = require('jsonwebtoken');
const Shipping = require('../models/Shipping');
const adminorder = require('../models/AdminOrder');
const User = require('../models/User');
const router = express.Router();
const multer = require('multer');

// Multer configuration for PDF file uploads
const storage = multer.memoryStorage();


const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});


router.post('/shipping', upload.fields([{ name: 'billPdf' }]), async (req, res) => {
  const { vehicleNumber, quantity, selectedProduct, orderId } = req.body;
  const billPdfFile = req.files?.billPdf?.[0];

  if (!vehicleNumber || !quantity || !selectedProduct || !orderId) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const order = await adminorder.findById(orderId).populate('user', 'email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const item = order.items.find((item) => item.name === selectedProduct);
    if (!item) {
      return res.status(400).json({ message: 'Selected product does not exist in the order.' });
    }

    if (quantity > item.quantity) {
      return res.status(400).json({ message: 'Quantity exceeds available order quantity.' });
    }

    const shippingData = {
      orderId,
      vehicleNumber,
      quantity: parseInt(quantity, 10),
      selectedProduct,
      userId: order.user._id,
      email: order.user.email,
      itemDetails: order.items.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity,
      })),
      subtotal: order.subtotal,
      gst: order.gst,
      totalPrice: order.totalPrice,
      shippingDate: new Date(),
    };

    if (billPdfFile) {
      shippingData.billPdf = {
        data: billPdfFile.buffer,
        contentType: billPdfFile.mimetype,
      };
    }

    const newShipping = new Shipping(shippingData);
    await newShipping.save();

    res.status(201).json({
      message: 'Shipping information saved successfully.',
      data: newShipping,
    });
  } catch (error) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ message: 'File size should not exceed 5 MB.' });
    } else {
      console.error('Error saving shipping information:', error.message);
      res.status(500).json({ message: 'Internal Server Error. Please try again later.' });
    }
  }
});


// Fetch shipping data by orderId
router.get('/shipping/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    const shippingData = await Shipping.find({ orderId }).select(
      'quantity selectedProduct vehicleNumber'
    );
    res.status(200).json(shippingData);
  } catch (error) {
    console.error('Error fetching shipping data:', error.message);
    res.status(500).json({ message: 'Error fetching shipping data.' });
  }
});

// Fetch shipping data for a user
router.get('/shippinguser', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user.id;

    const shippingDetails = await Shipping.find({ userId })
      .populate({
        path: 'orderId',
        select: '_id items subtotal gst totalPrice',
      })
      .select(
        'orderId invoiceId vehicleNumber selectedProduct quantity subtotal gst totalPrice shippingDate userId email itemDetails billPdf'
      );

    if (!shippingDetails || shippingDetails.length === 0) {
      return res.status(404).json({ message: 'No shipping details found for this user' });
    }

    const processedShippingDetails = shippingDetails.map((detail) => {
      const billPdf = detail.billPdf?.data
        ? {
            contentType: detail.billPdf.contentType,
            base64: detail.billPdf.data.toString('base64'),
          }
        : null;

      return {
        ...detail.toObject(),
        billPdf,
      };
    });

    res.status(200).json({ shippingDetails: processedShippingDetails });
  } catch (error) {
    console.error('Error fetching shipping details:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
