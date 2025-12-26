const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    sender: {
        type: String, // UID of sender
        required: true,
        ref: 'User'
    },
    recipient: {
        type: String, // UID of recipient
        required: true,
        ref: 'User'
    },
    content: {
        type: String,
        required: true
    },
    readStatus: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Message', MessageSchema);
