import mongoose from "mongoose";

const buyerSchema = new mongoose.Schema(
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

    businessProfile: {
      businessName: {
        type: String,
        default: "",
      },

      businessType: {
        type: String,
        default: "",
      },

      businessLocation: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

const Buyer = mongoose.model("Buyer", buyerSchema);

export default Buyer;