import mongoose from "mongoose";

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: String,
    mobileNumber: String,
    flatHouse: String,
    areaStreet: String,
    landmark: String,
    city: String,
    state: String,
    pincode: String,
    fullAddress: String,
  },
  { _id: false }
);

export default shippingAddressSchema;