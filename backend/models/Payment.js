const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  file: { type: Buffer, required: true },
  fileName: { type: String, required: true },
  fileType: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: String, ref: 'adminorder', required: true },
  approval: {
    approved: { type: Boolean, default: false },
    approvalDate: { type: Date },
    approvalNotes: { type: String },
  },
  paid: { type: String, default: '' }, // New field for "Paid"
});



module.exports = mongoose.model('Payment', paymentSchema);
