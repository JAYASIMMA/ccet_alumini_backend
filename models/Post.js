const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    authorName: {
        type: String,
        required: true
    },
    authorImage: {
        type: String
    },
    content: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        index: { expires: '1s' } // Deletes 1 second after the specified date
    }
});

module.exports = mongoose.model('Post', PostSchema);
