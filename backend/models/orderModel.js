// backend/models/orderModel.js

import mongoose from "mongoose";
import orderItemSchema from "./orderFiles/orderItemSchema.js";
import paymentReceiptSchema from "./orderFiles/paymentReceiptSchema.js";
import shipmentSchema from "./orderFiles/shipmentSchema.js";
import shippingAddressSchema from "./orderFiles/shippingAddressSchema.js";

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
    },

    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    shippingAddress: shippingAddressSchema,

    orderItems: [orderItemSchema],

    taxableAmount: {
      type: Number,
      default: 0,
    },

    gstType: {
      type: String,
      enum: ["cgst_sgst", "igst"],
      default: "igst",
    },

    buyerGstNumber: {
      type: String,
      default: "",
    },

    cgstAmount: {
      type: Number,
      default: 0,
    },

    sgstAmount: {
      type: Number,
      default: 0,
    },

    igstAmount: {
      type: Number,
      default: 0,
    },

    gstAmount: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      default: 0,
    },

    buyerPaidAmount: {
      type: Number,
      default: 0,
    },

    buyerPendingAmount: {
      type: Number,
      default: 0,
    },

    sellerPaidAmount: {
      type: Number,
      default: 0,
    },

    sellerPendingAmount: {
      type: Number,
      default: 0,
    },

    buyerPaymentStatus: {
      type: String,
      enum: ["pending", "partial", "completed"],
      default: "pending",
    },

    sellerPaymentStatus: {
      type: String,
      enum: ["pending", "partial", "completed"],
      default: "pending",
    },

    buyerPaymentReceipts: [paymentReceiptSchema],

    sellerPaymentReceipts: [paymentReceiptSchema],

    shipments: [shipmentSchema],

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "seller_confirmed",
        "partial_payment_uploaded",
        "partial_payment_verified",
        "payment_completed",
        "partially_shipped",
        "shipped",
        "delivered",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },

    sellerConfirmedAt: {
      type: Date,
    },

    paymentUploadedAt: {
      type: Date,
    },

    paymentVerifiedAt: {
      type: Date,
    },

    shippedAt: {
      type: Date,
    },

    deliveredAt: {
      type: Date,
    },

    completedAt: {
      type: Date,
    },

    cancelledAt: {
      type: Date,
    },

    cancellationReason: {
      type: String,
    },

    adminNotes: {
      type: String,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;