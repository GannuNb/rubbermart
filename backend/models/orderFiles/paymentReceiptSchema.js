import mongoose from "mongoose";
import uploadedFileSchema from "./uploadedFileSchema.js";

const paymentReceiptSchema = new mongoose.Schema(
  {
    file: uploadedFileSchema,

    uploadedAt: {
      type: Date,
      default: Date.now,
    },

    amount: {
      type: Number,
      required: true,
      default: 0,
    },

    paymentMode: {
      type: String,
      enum: ["bank_transfer", "upi", "cash", "cheque", "rtgs", "neft"],
      default: "bank_transfer",
    },

    transactionId: {
      type: String,
    },

    note: {
      type: String,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    verifiedAt: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },

    paymentFor: {
      type: String,
      enum: ["buyer_to_admin", "admin_to_seller"],
      required: true,
    },

    totalPaidTillNow: {
      type: Number,
      default: 0,
    },

    remainingAmount: {
      type: Number,
      default: 0,
    },

    isPartialPayment: {
      type: Boolean,
      default: true,
    },

    isFinalPayment: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default paymentReceiptSchema;