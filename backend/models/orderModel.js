// backend/models/orderModel.js

import mongoose from "mongoose";

const uploadedFileSchema = new mongoose.Schema(
  {
    data: {
      type: Buffer,
    },

    contentType: {
      type: String,
    },

    originalName: {
      type: String,
    },
  },
  { _id: false }
);

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: String,
    },

    application: {
      type: String,
    },

    productImage: uploadedFileSchema,

    requiredQuantity: {
      type: Number,
      required: true,
    },

    pricePerMT: {
      type: Number,
      required: true,
    },

    loadingLocation: {
      type: String,
    },

    hsnCode: {
      type: String,
    },

    subtotal: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const paymentReceiptSchema = new mongoose.Schema(
  {
    file: uploadedFileSchema,

    uploadedAt: {
      type: Date,
      default: Date.now,
    },

    amount: {
      type: Number,
      default: 0,
    },

    note: {
      type: String,
    },
  },
  { _id: false }
);

const shipmentSchema = new mongoose.Schema(
  {
    vehicleNumber: {
      type: String,
    },

    driverName: {
      type: String,
    },

    driverMobile: {
      type: String,
    },

    shipmentFile: uploadedFileSchema,

    shippedQuantity: {
      type: Number,
      default: 0,
    },

    shipmentStatus: {
      type: String,
      enum: [
        "pending",
        "way_ticket_raised",
        "shipped",
        "delivered",
      ],
      default: "pending",
    },

    shippedAt: {
      type: Date,
    },

    deliveredAt: {
      type: Date,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
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

    shippingAddress: {
      fullName: String,
      mobileNumber: String,
      flatHouse: String,
      areaStreet: String,
      landmark: String,
      city: String,
      state: String,
      pincode: String,
      fullAddress: String,
    },

    orderItems: [orderItemSchema],

    taxableAmount: {
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

    buyerPaymentReceipts: [paymentReceiptSchema],

    sellerPaymentReceipts: [paymentReceiptSchema],

    shipments: [shipmentSchema],

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "seller_confirmed",
        "payment_uploaded",
        "payment_verified",
        "partially_shipped",
        "shipped",
        "delivered",
        "completed",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;