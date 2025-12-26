const mongoose = require('mongoose');

const ConnectionSchema = new mongoose.Schema({
    requester: {
        type: String, // UID of the user sending the request
        required: true,
        ref: 'User'
    },
    recipient: {
        type: String, // UID of the user receiving the request
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to ensure unique pair of requester and recipient
ConnectionSchema.index({ requester: 1, recipient: 1 }, { unique: true });

module.exports = mongoose.model('Connection', ConnectionSchema);
