const mongoose = require('mongoose');
const { Schema } = mongoose;

// In your Uploadscrap schema:
const UploadscrapSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    material: {
        type: String,
        enum: ['Tyre scrap', 'pyro oil', 'Tyre steel scrap'],
        required: true
    },
    application: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [0, 'Quantity cannot be negative']
    },
    companyName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    loadingLocation: {
        type: String,
        enum: ['Ex_Chennai', 'Ex_Mundra', 'Ex_Nhavasheva'],
        required: true
    },
    countryOfOrigin: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative']
    },
    description: {
        type: String,  // Adding description field
        required: false // Optional field, user can provide it or leave it empty
    },
    images: [{ 
        data: Buffer,  // Store the binary data
        contentType: String  // Store the image content type (e.g., 'image/jpeg')
    }],
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Uploadscrap', UploadscrapSchema);
