import mongoose from "mongoose";
import uploadedFileSchema from "./uploadedFileSchema.js";

const paymentReceiptSchema = new mongoose.Schema(
  {
    /* =========================
       RECEIPT FILE
    ========================= */

    file: uploadedFileSchema,

    /* =========================
       BASIC PAYMENT INFO
    ========================= */

    amount: {
      type: Number,
      required: true,
      default: 0,
    },

    paymentMode: {
      type: String,
      enum: [
        "bank_transfer",
        "upi",
        "cash",
        "cheque",
        "rtgs",
        "neft",
      ],
      default: "bank_transfer",
    },

    transactionId: {
      type: String,
      default: "",
      trim: true,
    },

    note: {
      type: String,
      default: "",
      trim: true,
    },

    /* =========================
       PAYMENT TYPE
    ========================= */

    paymentFor: {
      type: String,
      enum: [
        "buyer_to_admin",
        "admin_to_seller",
      ],
      required: true,
    },

    /* =========================
       PAYMENT STATUS
    ========================= */

    status: {
      type: String,
      enum: [
        "pending",
        "verified",
        "rejected",
      ],
      default: "pending",
    },

    /* =========================
       TRACKING
    ========================= */

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
    },

    verifiedAt: {
      type: Date,
    },

    /* =========================
       PAYMENT CALCULATION
    ========================= */

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