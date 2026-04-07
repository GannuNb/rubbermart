import mongoose from "mongoose";

const buyerCompanyIdCounterSchema = new mongoose.Schema(
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

const BuyerCompanyIdCounter = mongoose.model(
  "BuyerCompanyIdCounter",
  buyerCompanyIdCounterSchema
);

export default BuyerCompanyIdCounter;
