const mongoose = require('mongoose');

// Custom ID generator
const generateCustomId = () => {
  const prefix = 'vk'; // Prefix for your custom ID
  const randomNum = Math.floor(Math.random() * 1000000000); // Generate a random number (up to 1 billion)
  return prefix + randomNum;
};

const AdminOrderItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

const AdminOrderSchema = new mongoose.Schema(
  {
    _id: {
      type: String, // Overriding default _id to be a string
      default: generateCustomId, // Set custom ID when creating a new document
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [AdminOrderItemSchema], // Array of items
    subtotal: {
      type: Number,
      required: true,
    },
    gst: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Placed', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Placed',
    },
  },
  { timestamps: true }
);

// Check if the model is already compiled, and use the existing model if so
module.exports = mongoose.models.adminorder || mongoose.model('adminorder', AdminOrderSchema);
