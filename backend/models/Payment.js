const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  files: [
    {
      file: { type: Buffer, required: true },
      fileName: { type: String, required: true },
      fileType: { type: String, required: true },
    },
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: String, ref: 'adminorder', required: true },
  approval: [{
    approved: { type: Boolean, default: false },
    approvalDate: { type: Date },
    approvalNotes: { type: String },
    amountPaid: { type: Number, default: 0 }, // Add amountPaid field
  }],
  paid: { type: Number, required: true, default: 0 },
});



module.exports = mongoose.model('Payment', paymentSchema);
