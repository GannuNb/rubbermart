const mongoose = require('mongoose');
const BusinessProfileCounter = require('./BusinessProfileCounter');


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
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
            profileId: { type: String, required: true }, // Add the profileId field
            registeredgst: { type: String, required: true },
            companyName: { type: String, required: true },
            phoneNumber: { type: String, required: true },
            email: { type: String, required: true },
            gstNumber: { type: String, required: true },
            pan: { type: String, required: true },
            billAddress: { type: String, required: true },
            shipAddress: { type: String, required: true },
        }
    ],
    resetToken: { type: String },
    tokenExpiry: { type: Date },
});

UserSchema.pre('save', function(next) {
    if (this.email) {
        this.email = this.email.toLowerCase();
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);
