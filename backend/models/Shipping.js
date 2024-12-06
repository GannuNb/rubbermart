const mongoose = require('mongoose');


const ShippingSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Adminorder', required: true },  // Update reference to Adminorder
    vehicleNumber: { type: String, required: true },
    quantity: { type: Number, required: true },
    selectedProduct: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    email: { type: String, required: true },
    itemDetails: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        total: { type: Number, required: true },
      },
    ],
    subtotal: { type: Number, required: true },
    gst: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    shippingDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Shipping', ShippingSchema);
