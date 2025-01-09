const mongoose = require('mongoose');

const BusinessProfileCounterSchema = new mongoose.Schema({
    counter: {
        type: Number,
        default: 1, // Start with 1 for the first profile globally
    }
});

module.exports = mongoose.model('BusinessProfileCounter', BusinessProfileCounterSchema);
