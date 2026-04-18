import mongoose from "mongoose";
import uploadedFileSchema from "./uploadedFileSchema.js";

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

export default shipmentSchema;