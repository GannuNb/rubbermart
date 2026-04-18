import mongoose from "mongoose";
import uploadedFileSchema from "./uploadedFileSchema.js";

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

export default orderItemSchema;