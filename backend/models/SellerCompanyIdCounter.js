import mongoose from "mongoose";

const sellerCompanyIdCounterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    sequenceValue: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const SellerCompanyIdCounter = mongoose.model(
  "SellerCompanyIdCounter",
  sellerCompanyIdCounterSchema
);

export default SellerCompanyIdCounter;