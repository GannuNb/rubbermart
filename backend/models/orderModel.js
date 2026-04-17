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

    productName: {
      type: String,
    },

    subProducts: [
      {
        type: String,
      },
    ],

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
        "approved_by_admin",
        "shipped",
        "delivered",
      ],
      default: "pending",
    },

    approvedByAdmin: {
      type: Boolean,
      default: false,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    approvedAt: {
      type: Date,
    },

    shipmentFrom: {
      type: String,
    },

    shipmentTo: {
      type: String,
    },

    selectedSubProducts: [
      {
        type: String,
      },
    ],

    shippedAt: {
      type: Date,
    },

    deliveredAt: {
      type: Date,
    },
  },
  {
    _id: true,
    timestamps: true,
  }
);

const shippingAddressSchema = new mongoose.Schema(
  {
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
  { _id: false }
);

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