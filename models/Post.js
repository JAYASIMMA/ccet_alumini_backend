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
    }
});

module.exports = mongoose.model('Post', PostSchema);
