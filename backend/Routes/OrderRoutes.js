// Routes/OrderRoutes.js

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const User = require('../models/User');
const ScrapItem = require('../models/ScrapItem'); 
const AdminOrder = require('../models/AdminOrder');
const Adminorder = require('../models/AdminOrder');


// Middleware to authenticate and attach user to request
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log('Authorization header missing');
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Assuming the token has a 'user' field
    console.log('User authenticated:', req.user);
    next();
  } catch (error) {
    console.log('Invalid token:', error.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};


router.post('/place-order', authenticate, async (req, res) => {
  console.log('Received order request:', req.body);
  try {
    const items = req.body.items;

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log('Validation failed: Missing or invalid items array');
      return res.status(400).json({ message: 'Items array must be provided' });
    }

    let totalSubtotal = 0;
    let totalGST = 0;
    let totalPrice = 0;

    const processedItems = [];

    for (const item of items) {
      const { name: itemName, quantity: requiredQuantity } = item;

      if (!itemName || !requiredQuantity) {
        console.log('Validation failed: Missing itemName or requiredQuantity');
        return res.status(400).json({ message: 'Each item must have a name and required quantity' });
      }

      const scrapItem = await ScrapItem.findOne({ name: itemName });
      if (!scrapItem) {
        console.log(`Scrap item not found: ${itemName}`);
        return res.status(404).json({ message: `Scrap item not found: ${itemName}` });
      }

      console.log(`Scrap item found: ${scrapItem.name}, Available: ${scrapItem.available_quantity}`);

      if (scrapItem.available_quantity < requiredQuantity) {
        console.log(`Insufficient quantity for ${itemName}: Requested ${requiredQuantity}, Available ${scrapItem.available_quantity}`);
        return res.status(400).json({ message: `Insufficient quantity available for ${itemName}` });
      }

      const pricePerTon = scrapItem.price;
      const subtotal = pricePerTon * requiredQuantity;
      const gst = subtotal * 0.18;
      const itemTotalPrice = subtotal + gst;

      console.log(`Order Calculation for ${itemName} - Subtotal: ${subtotal}, GST: ${gst}, Total: ${itemTotalPrice}`);

      scrapItem.available_quantity -= requiredQuantity;
      await scrapItem.save();
      console.log(`Updated scrap item quantity for ${itemName}: ${scrapItem.available_quantity}`);

      totalSubtotal += subtotal;
      totalGST += gst;
      totalPrice += itemTotalPrice;

      processedItems.push({
        name: itemName,
        price: pricePerTon,
        quantity: requiredQuantity,
        total: itemTotalPrice,
        remainingQuantity: scrapItem.available_quantity, // Store remaining quantity
      });
    }

    const newOrder = new Order({
      user: req.user.id,
      items: processedItems,
      subtotal: totalSubtotal,
      gst: totalGST,
      totalPrice: totalPrice,
    });

    await newOrder.save();
    console.log('Order saved successfully:', newOrder);

    res.status(200).json({
      message: 'Order placed successfully',
      remainingQuantities: processedItems.map(item => ({
        name: item.name,
        remainingQuantity: item.remainingQuantity, // Correctly access the remaining quantity
      })),
      order: newOrder,
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



router.get('/adminorders', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    // Find orders for the logged-in user
    const orders = await AdminOrder.find({ user: userId }).populate('user', 'email');
    res.status(200).json(orders); // Return the orders
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});





router.post('/Adminorder', authenticate, async (req, res) => {
  console.log('Received order request:', req.body);
  try {
    const { items, billingAddress, shippingAddress, isSameAsBilling } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log('Validation failed: Missing or invalid items array');
      return res.status(400).json({ message: 'Items array must be provided' });
    }

    let totalSubtotal = 0;
    let totalGST = 0;
    let totalPrice = 0;

    const processedItems = [];

    for (const item of items) {
      const { name: itemName, quantity: requiredQuantity, price: pricePerTon, loading_location } = item;

      // Validate item properties
      if (!itemName || !requiredQuantity || !pricePerTon || !loading_location) {
        console.log('Validation failed: Missing itemName, requiredQuantity, price, or loading_location');
        return res.status(400).json({ message: 'Each item must have a name, required quantity, price, and loading location' });
      }

      // Find the scrap item
      const scrapItem = await ScrapItem.findOne({ name: itemName });
      if (!scrapItem) {
        console.log(`Scrap item not found: ${itemName}`);
        return res.status(404).json({ message: `Scrap item not found: ${itemName}` });
      }

      // Check availability at the selected location and reduce the respective location's quantity
      let quantityToReduce = requiredQuantity;

      if (loading_location === 'ex_chennai') {
        if (scrapItem.chennai_quantity < requiredQuantity) {
          console.log(`Insufficient quantity at Chennai for ${itemName}: Requested ${requiredQuantity}, Available ${scrapItem.chennai_quantity}`);
          return res.status(400).json({ message: `Insufficient quantity at Chennai for ${itemName}` });
        }
        scrapItem.chennai_quantity -= quantityToReduce; // Reduce the Chennai-specific quantity
        console.log(`Updated Chennai quantity for ${itemName}: ${scrapItem.chennai_quantity}`);
      } else if (loading_location === 'ex_mundra') {
        if (scrapItem.mundra_quantity < requiredQuantity) {
          console.log(`Insufficient quantity at Mundra for ${itemName}: Requested ${requiredQuantity}, Available ${scrapItem.mundra_quantity}`);
          return res.status(400).json({ message: `Insufficient quantity at Mundra for ${itemName}` });
        }
        scrapItem.mundra_quantity -= quantityToReduce; // Reduce the Mundra-specific quantity
        console.log(`Updated Mundra quantity for ${itemName}: ${scrapItem.mundra_quantity}`);
      } else if (loading_location === 'ex_nhavasheva') {
        if (scrapItem.nhavasheva_quantity < requiredQuantity) {
          console.log(`Insufficient quantity at Nhavasheva for ${itemName}: Requested ${requiredQuantity}, Available ${scrapItem.nhavasheva_quantity}`);
          return res.status(400).json({ message: `Insufficient quantity at Nhavasheva for ${itemName}` });
        }
        scrapItem.nhavasheva_quantity -= quantityToReduce; // Reduce the Nhavasheva-specific quantity
        console.log(`Updated Nhavasheva quantity for ${itemName}: ${scrapItem.nhavasheva_quantity}`);
      } else {
        return res.status(400).json({ message: `Invalid loading location for ${itemName}` });
      }

      // Calculate subtotal, GST, and total price
      const subtotal = pricePerTon * requiredQuantity;
      const gst = subtotal * 0.18;
      const itemTotalPrice = subtotal + gst;

      totalSubtotal += subtotal;
      totalGST += gst;
      totalPrice += itemTotalPrice;

      await scrapItem.save(); // Save the updated location-specific quantities

      processedItems.push({
        name: itemName,
        price: pricePerTon,
        quantity: requiredQuantity,
        total: itemTotalPrice,
        loading_location, // Store the loading location here
      });
    }

    // Determine final shipping address
    const finalShippingAddress = isSameAsBilling ? billingAddress : shippingAddress;

    // Ensure finalShippingAddress is validated
    if (!finalShippingAddress || finalShippingAddress.trim() === '') {
      console.log('Validation failed: Shipping address is required');
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    // Create a new order in Adminorder collection
    const newOrder = new Adminorder({
      user: req.user.id,
      items: processedItems,
      subtotal: totalSubtotal,
      gst: totalGST,
      totalPrice: totalPrice,
      billingAddress,
      shippingAddress: finalShippingAddress,
      isSameAsBilling,
    });

    await newOrder.save();
    console.log('Order saved successfully:', newOrder);

    res.status(200).json({
      message: 'Order placed successfully',
      order: newOrder,
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/admin/orders', async (req, res) => {
  try {
    // Retrieve all orders with user and business profile details
    const orders = await Adminorder.find()
      .populate('user', 'name email businessProfiles')
      .exec();

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router;
