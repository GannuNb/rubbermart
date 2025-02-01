// const mongoose = require('mongoose');

// const OrderItemSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   price: {
//     type: Number,
//     required: true,
//   },
//   quantity: {
//     type: Number,
//     required: true,
//   },
//   total: {
//     type: Number,
//     required: true,
//   },
// });

// const OrderSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     items: [OrderItemSchema], // Array of items
//     subtotal: {
//       type: Number,
//       required: true,
//     },
//     gst: {
//       type: Number,
//       required: true,
//     },
//     totalPrice: {
//       type: Number,
//       required: true,
//     },
//     orderDate: {
//       type: Date,
//       default: Date.now,
//     },
//     status: {
//       type: String,
//       enum: ['Placed', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
//       default: 'Placed',
//     },
//   },
//   { timestamps: true }
// );


// module.exports = mongoose.model('Order', OrderSchema);
