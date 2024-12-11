const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, // Automatically converts emails to lowercase
    },
    password: {
        type: String,
        required: true,
    },
    location: {
        type: String,
    },
    businessProfiles: [
        {
            registeredgst:{ type: String, required: true },
            companyName: { type: String, required: true },
            phoneNumber: { type: String, required: true },
            email: { type: String, required: true },
            gstNumber: { type: String, required: true },
            pan: { type: String, required: true }, // New Field
            billAddress: { type: String, required: true }, // New Field
            shipAddress: { type: String, required: true },
        }
    ],
    resetToken: { type: String },
    tokenExpiry: { type: Date },
});

// Pre-save middleware to enforce lowercase
UserSchema.pre('save', function(next) {
    if (this.email) {
        this.email = this.email.toLowerCase();
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);
