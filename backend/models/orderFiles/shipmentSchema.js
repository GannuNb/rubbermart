import mongoose from "mongoose";
import uploadedFileSchema from "./uploadedFileSchema.js";
import paymentReceiptSchema from "./paymentReceiptSchema.js";

const shipmentSchema = new mongoose.Schema(
  {
    /* =========================
       SHIPMENT IDENTITY
    ========================= */

    shipmentInvoiceId: {
      type: String,
    },

    /* =========================
       ITEM DETAILS
    ========================= */

    orderItemId: {
      type: String,
    },

    selectedItem: {
      type: String,
    },

    selectedSubProducts: [
      {
        type: String,
      },
    ],

    shippedQuantity: {
      type: Number,
      default: 0,
    },

    /* =========================
       TRANSPORT MODE
    ========================= */

    transportMode: {
      type: String,
      enum: ["self_transport", "marketplace_transport"],
      default: "self_transport",
    },
    /* =========================
          TRANSPORT TAX DETAILS
       ========================= */

    transportHSNCode: {
      type: String,
      default: "9965",
    },

    /*  =========================
          TRANSPORT PAYMENT
        ========================= */

    transportPrice: {
      type: Number,
      default: 0,
    },

    transportGSTPercent: {
      type: Number,
      default: 5,
    },
    transportGSTType: {
      type: String,

      enum: ["igst", "cgst_sgst"],

      default: "igst",
    },
    transportGSTAmount: {
      type: Number,
      default: 0,
    },

    transportFinalAmount: {
      type: Number,
      default: 0,
    },

    transportPaymentStatus: {
      type: String,

      enum: [
        "unpaid",
        "payment_submitted",
        "partial_paid",
        "paid",
        "payment_rejected",
      ],

      default: "unpaid",
    },

    transportPaymentReceipts: [paymentReceiptSchema],
    /*  =========================
          ADMIN → TRANSPORTER PAYMENTS
        ========================= */

        adminTransportPaymentReceipts: [
          paymentReceiptSchema,
        ],

    /* =========================
       SHIPMENT STATUS
    ========================= */

    shipmentStatus: {
      type: String,
      enum: [
        "pending",
        "packed",
        "assigned",
        "shipped",
        "in_transit",
        "delivered",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },

    /* =========================
       TRANSPORT WORKFLOW STATUS
    ========================= */

    transportStatus: {
      type: String,
      enum: [
        "not_required",
        "open_for_quotes",
        "quotes_received",
        "admin_assignment_pending",
        "transporter_assigned",
        "admin_assignment_rejected",
        "completed",
      ],
      default: "not_required",
    },

    /* =========================
       LOCATION DETAILS
    ========================= */

    shipmentFrom: {
      type: String,
    },

    shipmentTo: {
      type: String,
    },

    /* =========================
       SHIPMENT PROOF FILES
    ========================= */

    packedItemPhoto: uploadedFileSchema,

    weightTicket: uploadedFileSchema,

    /* =========================
       SELF TRANSPORT DETAILS
    ========================= */

    vehicleNumber: {
      type: String,
    },

    driverName: {
      type: String,
    },

    driverMobile: {
      type: String,
    },

    /* =========================
       TRANSPORTER ASSIGNMENT
    ========================= */

    assignedTransporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    adminAssignedPrice: {
      type: Number,
    },

    adminAssignmentNote: {
      type: String,
    },

    adminAssignedAt: {
      type: Date,
    },

    selectedQuoteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShipmentTransportQuote",
    },

    assignmentMethod: {
      type: String,
      enum: ["self_transport", "quote_selection", "admin_direct_assignment"],
      default: "self_transport",
    },

    /* =========================
       TIMELINE
    ========================= */

    packedAt: {
      type: Date,
    },

    assignedAt: {
      type: Date,
    },

    pickedUpAt: {
      type: Date,
    },

    inTransitAt: {
      type: Date,
    },

    deliveredAt: {
      type: Date,
    },

    completedAt: {
      type: Date,
    },
  },
  {
    _id: true,
    timestamps: true,
  },
);

export default shipmentSchema;
