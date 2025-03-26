// Routes/OrderRoutes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const User = require('../models/User');
const ScrapItem = require('../models/ScrapItem'); 
const AdminOrder = require('../models/AdminOrder');
const Adminorder = require('../models/AdminOrder');
const mongoose = require('mongoose');
const Approval = require('../models/Approval');

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
    const { items, billingAddress, shippingAddress, isSameAsBilling, id } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log('Validation failed: Missing or invalid items array');
      return res.status(400).json({ message: 'Items array must be provided' });
    }

    let totalSubtotal = 0;
    let totalGST = 0;
    let totalPrice = 0;

    const processedItems = [];

    // GST rate is fixed at 18%
    const gstRate = 0.18;

    // Iterate through all items in the order
    for (const item of items) {
      const { name: itemName, quantity: requiredQuantity, price: pricePerTon, loading_location, scrapid, sellerid } = item;

      // Validate item properties
      if (!itemName || !requiredQuantity || !pricePerTon || !loading_location || !scrapid) {
        console.log('Validation failed: Missing itemName, requiredQuantity, price, loading location, or scrapid');
        return res.status(400).json({ message: 'Each item must have a name, required quantity, price, loading location, and scrapid' });
      }

      console.log(`Looking for Approval record with scrapid: ${scrapid} and application: ${itemName}`);

      // Find the approval record for the given scrapid and application
      const approvalRecord = await Approval.findOne({
        _id: new mongoose.Types.ObjectId(scrapid),
        application: itemName, // Match on application name
      });

      if (!approvalRecord) {
        console.log(`Approval record not found for ${itemName}`);
        return res.status(404).json({ message: `Approval record not found for ${itemName}` });
      }

      // Check if there's sufficient quantity in the approval record
      if (approvalRecord.quantity < requiredQuantity) {
        console.log(`Insufficient quantity for ${itemName}: Requested ${requiredQuantity}, Available ${approvalRecord.quantity}`);
        return res.status(400).json({ message: `Insufficient quantity for ${itemName}` });
      }

      // Reduce the quantity in the Approval record
      approvalRecord.quantity -= requiredQuantity;

      // Save the updated approval record for each item
      await approvalRecord.save(); // Save the updated quantity to the database
      console.log(`Quantity updated for ${itemName}, new quantity: ${approvalRecord.quantity}`);

      // Calculate subtotal, GST, and total price for this item
      const subtotal = pricePerTon * requiredQuantity;
      const gst = subtotal * gstRate;  // Always apply 18% GST
      const itemTotalPrice = subtotal + gst;

      // Accumulate totals for the entire order
      totalSubtotal += subtotal;
      totalGST += gst;
      totalPrice += itemTotalPrice;

      // Push the processed item details into the array for the order
      processedItems.push({
        sellerid,
        name: itemName,
        price: pricePerTon,
        quantity: requiredQuantity,
        total: itemTotalPrice,
        loading_location,
      });
    }

    // Determine final shipping address (billing address if same)
    const finalShippingAddress = isSameAsBilling ? billingAddress : shippingAddress;

    // Ensure finalShippingAddress is validated
    if (!finalShippingAddress || finalShippingAddress.trim() === '') {
      console.log('Validation failed: Shipping address is required');
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    // Create a new order in the Adminorder collection
    const newOrder = new Adminorder({
      user: req.user.id, // User from the authenticated session
      items: processedItems,
      subtotal: totalSubtotal,
      gst: totalGST,
      totalPrice: totalPrice,
      billingAddress,
      shippingAddress: finalShippingAddress,
      isSameAsBilling,
    });

    // Save the new order to the database
    await newOrder.save();
    console.log('Order saved successfully:', newOrder);

    // Respond with success message and order details
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
      .populate('user', 'name email businessProfiles ')
      .exec();

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.get('/applications', async (req, res) => {
  try {
    const { id } = req.query; // Only filter by postedBy (id)
    if (!id) {
      return res.status(400).json({ message: "Missing id (postedBy)" });
    }

    // Fetch approvals along with 'scrapid', 'application', 'price', 'loadingLocation'
    const approvals = await Approval.find({ postedBy: id }).select('application price loadingLocation quantity');

    if (approvals.length === 0) {
      return res.status(404).json({ message: "No applications found for this id" });
    }

    // Send the application names along with price, loadingLocation, and scrapid (converted to string)
    res.status(200).json(approvals.map(app => ({
      scrapid: app._id.toString(),       // Use app._id to get the ObjectId and convert it to string
      application: app.application,
      price: app.price,
      loadingLocation: app.loadingLocation,
      quantity:app.quantity
    })));

  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Server error" });
  }
});




module.exports = router;
