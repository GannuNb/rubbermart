const mongoose = require('mongoose');

// Helper function to calculate the financial year
const getFinancialYear = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // Months are zero-based
  if (currentMonth <= 3) {
    // If it's January to March, the financial year is previous year - current year
    return `${String(currentYear - 1).slice(2)}-${String(currentYear).slice(2)}`;
  } else {
    // Otherwise, it's current year - next year
    return `${String(currentYear).slice(2)}-${String(currentYear + 1).slice(2)}`;
  }
};

// Model to store the last used order ID
const OrderIdCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // This will store a string like 'orderID'
  counter: { type: Number, default: 0 }, // This will store the current counter
});

const OrderIdCounter = mongoose.model('OrderIdCounter', OrderIdCounterSchema);

// Custom ID generator
const generateCustomId = async () => {
  const prefix = `VRO_${getFinancialYear()}_`;
  const counter = await OrderIdCounter.findOneAndUpdate(
    { _id: 'orderID' }, // The unique ID for order tracking
    { $inc: { counter: 1 } }, // Increment the counter by 1
    { new: true, upsert: true } // Create the counter if it doesn't exist
  );
  const id = prefix + String(counter.counter).padStart(2, '0'); // Pad counter with leading zeros
  return id;
};

// Schema for order items
const AdminOrderItemSchema = new mongoose.Schema({

  sellerid: {
    type: String,
    required: true,
  },

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
  loading_location: {  // New field to store the loading location
    type: String,
    required: true,
    enum: ['ex_chennai', 'ex_mundra', 'ex_nhavasheva'], // Add the allowed locations
  },
});

// Schema for the admin order
const AdminOrderSchema = new mongoose.Schema(
  {
    _id: {
      type: String, // Overriding default _id to be a string
      required: false, // Make _id optional during document creation
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
    shippingAddress: {  // Add a new field for the shipping address
      type: String,
      required: true,  // Mark as required or optional depending on your needs
    },
  },
  { timestamps: true }
);

// Pre-save hook to generate custom ID
AdminOrderSchema.pre('save', async function (next) {
  if (!this._id) {
    try {
      this._id = await generateCustomId(); // Generate custom ID if not already set
      next();
    } catch (err) {
      next(err); // Pass the error to next
    }
  } else {
    next(); // Proceed if the ID is already set
  }
});

// Check if the model is already compiled, and use the existing model if so
module.exports = mongoose.models.adminorder || mongoose.model('adminorder', AdminOrderSchema);
