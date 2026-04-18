import mongoose from "mongoose";

const uploadedFileSchema = new mongoose.Schema(
  {
    data: {
      type: Buffer,
    },

    contentType: {
      type: String,
    },

    originalName: {
      type: String,
    },
  },
  { _id: false }
);

export default uploadedFileSchema;