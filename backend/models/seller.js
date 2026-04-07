import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
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
            enum: ["seller"],
            default: "seller",
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

const Seller = mongoose.model("Seller", sellerSchema);

export default Seller;