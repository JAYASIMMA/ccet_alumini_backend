const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, default: 'Full-time' }, // Full-time, Intern, etc.
    link: String,
    description: String,
    postedBy: { type: String, required: true }, // User UID
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);
