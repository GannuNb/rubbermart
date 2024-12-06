const express = require('express');
const jwt = require('jsonwebtoken');
const Shipping = require('../models/Shipping'); // Adjust the path as needed
const AdminOrder = require('../models/AdminOrder'); // Adjust the path as needed
const User = require('../models/User');

const router = express.Router();

router.post('/shipping', async (req, res) => {
  const { vehicleNumber, quantity, selectedProduct, orderId } = req.body;

  // Validate required fields
  if (!vehicleNumber || !quantity || !selectedProduct || !orderId) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Find the order by ID and populate user details
    const order = await AdminOrder.findById(orderId).populate('user', 'email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Find the selected product in the order
    const item = order.items.find((item) => item.name === selectedProduct);
    if (!item) {
      return res.status(400).json({ message: 'Selected product does not exist in the order.' });
    }

    // Ensure quantity is valid
    if (quantity > item.quantity) {
      return res.status(400).json({ message: 'Quantity exceeds available order quantity.' });
    }

    // Prepare shipping data
    const shippingData = {
      orderId: order._id,
      vehicleNumber,
      quantity,
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

    // Save shipping information
    const newShipping = new Shipping(shippingData);
    await newShipping.save();

    res.status(201).json({ message: 'Shipping information saved successfully.', data: newShipping });
  } catch (error) {
    console.error('Error saving shipping information:', error.message);
    res.status(500).json({ message: 'Internal Server Error. Please try again later.' });
  }
});


router.get('/shipping/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    const shippingData = await Shipping.find({ orderId }).select('quantity selectedProduct');
    res.status(200).json(shippingData);
  } catch (error) {
    console.error('Error fetching shipping data:', error.message);
    res.status(500).json({ message: 'Error fetching shipping data.' });
  }
});






router.get('/shippinguser', async (req, res) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    // Extract token from the header
    const token = authHeader.split(' ')[1];
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Adjust with your secret key
    const userId = decoded.user.id; // Assuming the token contains user.id

    // Fetch shipping details specific to the user, including itemDetails
    const shippingDetails = await Shipping.find({ userId })
      .populate('orderId') // Populate the Order reference (AdminOrder)
      .populate('userId', 'email') // Populate the email from the User model (if necessary)
      .select('orderId vehicleNumber selectedProduct quantity subtotal gst totalPrice shippingDate userId email itemDetails'); // Include itemDetails in the select fields

    // If no shipping details are found, return an empty array
    if (!shippingDetails || shippingDetails.length === 0) {
      return res.status(200).json({ shippingDetails: [] });
    }

    // Return the populated shipping details
    return res.status(200).json({ shippingDetails });
  } catch (error) {
    console.error('Error fetching shipping details:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});



module.exports = router;
