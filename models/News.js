const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    department: {
        type: String,
        default: 'General'
    },
    date: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String // Optional URL for news image
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('News', NewsSchema);
