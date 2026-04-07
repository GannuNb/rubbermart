// backend/models/User.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    password: {
      type: String,
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },

    authProvider: {
      type: String,
      enum: ["manual", "google"],
      default: "manual",
    },

    role: {
      type: String,
      enum: ["buyer", "seller"],
      default: "buyer",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    businessProfileCompleted: {
      type: Boolean,
      default: false,
    },

    businessProfile: {
      companyId: {
        type: String,
        default: "",
      },

      companyName: {
        type: String,
        default: "",
      },

      phoneNumber: {
        type: String,
        default: "",
      },

      email: {
        type: String,
        default: "",
      },

      gstNumber: {
        type: String,
        default: "",
      },

      panNumber: {
        type: String,
        default: "",
      },

      billingAddress: {
        type: String,
        default: "",
      },

      shippingAddress: {
        type: String,
        default: "",
      },

      sameAsBillingAddress: {
        type: Boolean,
        default: false,
      },

      interestedProducts: {
        type: [String],
        default: [],
      },

      gstCertificate: {
        data: Buffer,
        contentType: String,
        originalName: String,
      },

      panCertificate: {
        data: Buffer,
        contentType: String,
        originalName: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;