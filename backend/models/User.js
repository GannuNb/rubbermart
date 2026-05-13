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

    addresses: [
      {
        fullName: {
          type: String,
          default: "",
        },

        mobileNumber: {
          type: String,
          default: "",
        },

        flatHouse: {
          type: String,
          default: "",
        },

        areaStreet: {
          type: String,
          default: "",
        },

        landmark: {
          type: String,
          default: "",
        },

        city: {
          type: String,
          default: "",
        },

        state: {
          type: String,
          default: "",
        },

        pincode: {
          type: String,
        },
      },
    ],

    password: {
      type: String,
      default: "",
    },
    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpire: {
      type: Date,
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
      enum: ["buyer", "seller", "admin"],
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
  },
);

const User = mongoose.model("User", userSchema);

export default User;
