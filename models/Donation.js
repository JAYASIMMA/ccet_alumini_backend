const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
    donorName: {
        type: String,
        required: true
    },
    donorId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    campaign: {
        type: String,
        required: true
    },
    message: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Donation', DonationSchema);
