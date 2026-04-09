import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
});

const sellerAddedProductSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: String,
      enum: ["Tyre Scrap", "Pyro Oil", "Tyre Steel Scrap"],
      required: true,
    },

    application: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    loadingLocation: {
      type: String,
      enum: ["Ex Chennai", "Ex Mundra", "Ex Nhavasheva"],
      required: true,
    },

    countryOfOrigin: {
      type: String,
      required: true,
    },

    pricePerMT: {
      type: Number,
      required: true,
    },

    hsnCode: {
      type: String,
      required: true,
    },

    images: [imageSchema],

    description: {
      type: String,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "SellerAddedProduct",
  sellerAddedProductSchema
);