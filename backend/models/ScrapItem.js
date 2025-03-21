// models/ScrapItem.js

const mongoose = require('mongoose');

const ScrapItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    type: {
        type: String,
        required: [true, 'Type is required'],
        trim: true,
    },
    available_quantity: {
        type: Number,
        required: [true, 'Available Quantity is required'],
        min: [0, 'Available Quantity cannot be negative'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
    },
    ex_chennai: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
    },
    ex_nhavasheva: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
    },
    ex_mundra: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
    },
    chennai_quantity: {
        type: Number,
        required: [true, 'chennai quantity is required'],
        min: [0, 'quantity  cannot be negative'],
    },
    mundra_quantity: {
        type: Number,
        required: [true, 'mundra quantity is required'],
        min: [0, 'quantity  cannot be negative'],
    },
    nhavasheva_quantity: {
        type: Number,
        required: [true, 'nhavasheva quantity is required'],
        min: [0, 'quantity  cannot be negative'],
    },
    hsn: { // Added the 'hsn' field
        type: String,
        required: [true, 'HSN is required'],
        trim: true,
    }
},
{
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Use singular model name; Mongoose will pluralize it to 'scrapitems'
module.exports = mongoose.model('ScrapItem', ScrapItemSchema);
