const mongoose = require('mongoose');

const ShippingSchema = new mongoose.Schema(
  {
    orderId: {
      type: String, // Match custom ID type
      ref: 'adminorder',
      required: true,
    },
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

const Shipping = mongoose.model('Shipping', ShippingSchema);
module.exports = Shipping;
