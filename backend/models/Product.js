// backend/models/Product.js

import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
});

const reviewImageSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
});

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
    },

    image: reviewImageSchema,

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true },
);

const productSchema = new mongoose.Schema(
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
      required: true,
      trim: true,
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
    stockStatus: {
      type: String,
      enum: ["available", "soldout"],
      default: "available",
    },
    reviews: [reviewSchema],
    averageRating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
