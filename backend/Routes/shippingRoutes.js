const express = require('express');
const jwt = require('jsonwebtoken');
const Shipping = require('../models/Shipping'); // Adjust the path as needed
const AdminOrder = require('../models/Adminorder'); // Adjust the path as needed
const User = require('../models/User');
const router = express.Router();
const multer = require('multer');



// Multer configuration for PDF file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post('/shipping', upload.fields([{ name: 'billPdf' }, { name: 'invoicePdf' }]), async (req, res) => {
  const { vehicleNumber, quantity, selectedProduct, orderId } = req.body;
  const billPdfFile = req.files?.billPdf?.[0];
  const invoicePdfFile = req.files?.invoicePdf?.[0];

  // Validate input fields
  if (!vehicleNumber || !quantity || !selectedProduct || !orderId) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const order = await AdminOrder.findById(orderId).populate('user', 'email');
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
      orderId: order._id,
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
    };

    // Attach PDF files if they exist
    if (billPdfFile) {
      shippingData.billPdf = {
        data: billPdfFile.buffer,
        contentType: billPdfFile.mimetype,
      };
    }

    if (invoicePdfFile) {
      shippingData.invoicePdf = {
        data: invoicePdfFile.buffer,
        contentType: invoicePdfFile.mimetype,
      };
    }

    const newShipping = new Shipping(shippingData);
    await newShipping.save();

    res.status(201).json({
      message: 'Shipping information saved successfully.',
      data: newShipping,
    });
  } catch (error) {
    console.error('Error saving shipping information:', error.message);
    res.status(500).json({ message: 'Internal Server Error. Please try again later.' });
  }
});






router.get('/shipping/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    const shippingData = await Shipping.find({ orderId }).select('quantity selectedProduct vehicleNumber');
    res.status(200).json(shippingData);
  } catch (error) {
    console.error('Error fetching shipping data:', error.message);
    res.status(500).json({ message: 'Error fetching shipping data.' });
  }
});









router.get('/shippinguser', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user.id;

    // Fetch shipping details for the user
    const shippingDetails = await Shipping.find({ userId })
      .populate('orderId') // Populate the order reference
      .populate('userId', 'email') // Populate the user's email
      .select(
        'orderId vehicleNumber selectedProduct quantity subtotal gst totalPrice shippingDate userId email itemDetails billPdf invoicePdf'
      );

    if (!shippingDetails || shippingDetails.length === 0) {
      return res.status(404).json({ message: 'No shipping details found for this user' });
    }

    // Process details, converting PDFs to Base64
    const processedShippingDetails = shippingDetails.map((detail) => {
      const billPdf = detail.billPdf?.data
        ? {
            contentType: detail.billPdf.contentType,
            base64: detail.billPdf.data.toString('base64'),
          }
        : null;

      const invoicePdf = detail.invoicePdf?.data
        ? {
            contentType: detail.invoicePdf.contentType,
            base64: detail.invoicePdf.data.toString('base64'),
          }
        : null;

      return {
        ...detail.toObject(),
        billPdf,
        invoicePdf,
      };
    });

    return res.status(200).json({ shippingDetails: processedShippingDetails });
  } catch (error) {
    console.error('Error fetching shipping details:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});






  

module.exports = router;
