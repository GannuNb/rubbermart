import mongoose from "mongoose";
import uploadedFileSchema from "./uploadedFileSchema.js";

const shipmentSchema = new mongoose.Schema(
  {
    shipmentInvoiceId: {
      type: String,
    },

    selectedItem: {
      type: String,
    },

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
        "shipped",
        "delivered",
        "rejected",
      ],
      default: "pending",
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