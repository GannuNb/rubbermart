// backend/models/CompanyIdCounter.js

import mongoose from "mongoose";

const companyIdCounterSchema = new mongoose.Schema(
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

const CompanyIdCounter = mongoose.model(
  "CompanyIdCounter",
  companyIdCounterSchema
);

export default CompanyIdCounter;