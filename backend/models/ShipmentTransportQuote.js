import mongoose from "mongoose";

const shipmentTransportQuoteSchema =
  new mongoose.Schema(
    {
      /* =========================
         RELATIONS
      ========================= */

      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
      },

      shipmentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },

      transporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      /* =========================
         QUOTE DETAILS
      ========================= */

      quotedPrice: {
        type: Number,
        required: true,
      },

      note: {
        type: String,
        default: "",
        trim: true,
      },

      estimatedDeliveryDays: {
        type: Number,
        default: 1,
      },

      /* =========================
         QUOTE STATUS
      ========================= */

      quoteStatus: {
        type: String,
        enum: [
          "submitted",
          "selected",
          "rejected",
        ],
        default: "submitted",
      },

      /* =========================
         TIMELINE
      ========================= */

      submittedAt: {
        type: Date,
        default: Date.now,
      },

      selectedAt: {
        type: Date,
      },

      rejectedAt: {
        type: Date,
      },
    },
    {
      timestamps: true,
    }
  );

/* =========================
   PREVENT DUPLICATE QUOTES
========================= */

shipmentTransportQuoteSchema.index(
  {
    shipmentId: 1,
    transporter: 1,
  },
  { unique: true }
);

const ShipmentTransportQuote = mongoose.model( "ShipmentTransportQuote", shipmentTransportQuoteSchema);

export default ShipmentTransportQuote;