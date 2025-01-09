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

// Schema to store the last used invoice ID counter
const InvoiceIdCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // This will store a string like 'invoiceId'
  counter: { type: Number, default: 0 }, // This will store the current counter
});

const InvoiceIdCounter = mongoose.model('InvoiceIdCounter', InvoiceIdCounterSchema);

// Function to generate a new `invoiceId`
const generateInvoiceId = async () => {
  const prefix = `VRI_${getFinancialYear()}_`;
  const counter = await InvoiceIdCounter.findOneAndUpdate(
    { _id: 'invoiceId' },
    { $inc: { counter: 1 } },
    { new: true, upsert: true } // Create the counter if it doesn't exist
  );
  return prefix + String(counter.counter).padStart(2, '0'); // Format as VRI_XX-XX_01
};

// Define the Shipping Schema
const ShippingSchema = new mongoose.Schema(
  {
    orderId: { type: String, ref: 'adminorder', required: true },
    vehicleNumber: { type: String, required: true },
    quantity: { type: Number, required: true },
    selectedProduct: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    email: { type: String, required: true },
    invoiceId: { type: String, unique: true }, // Unique invoice ID
    shipmentFrom: { type: String, required: true }, // New field for shipment origin (from)
    itemDetails: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    subtotal: { type: Number, required: true },
    gst: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    shippingDate: { type: Date, required: true },
    billPdf: {
      contentType: { type: String },
      data: { type: Buffer },
    },
  },
  { timestamps: true }
);

// Pre-save hook to generate `invoiceId`
ShippingSchema.pre('save', async function (next) {
  if (!this.invoiceId) {
    try {
      this.invoiceId = await generateInvoiceId(); // Generate the invoice ID
      next();
    } catch (error) {
      next(error); // Pass the error to the next middleware
    }
  } else {
    next(); // Skip if `invoiceId` already exists
  }
});

// Create the Shipping model
const Shipping = mongoose.model('Shipping', ShippingSchema);

module.exports = Shipping;
