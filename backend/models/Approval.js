const mongoose = require('mongoose');
const { Schema } = mongoose;


const ApprovalSchema = new Schema({
    scrapItem: {
        type: Schema.Types.ObjectId,
        ref: 'Uploadscrap',
        required: true
    },
    approvedAt: {
        type: Date,
        default: Date.now
    },
    material: {
        type: String,
        required: true
    },
    application: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    price: {
        type: Number,  // Add price to the schema
        required: true
    },
    loadingLocation: {
        type: String,  // Add loading location to the schema
        required: true
    },
    countryOfOrigin: {
        type: String,  // Add country of origin to the schema
        required: true
    },
    postedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    images: [
        {
            data: Buffer,
            contentType: { type: String }
        }
    ]
});



module.exports = mongoose.model('Approval', ApprovalSchema);
