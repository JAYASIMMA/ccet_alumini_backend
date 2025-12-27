const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true }, // Using UID from Flutter or generating one
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // For simple auth
    profileImageUrl: String,
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    department: { type: String, required: true },
    rollNumber: { type: String, required: true },
    completedYear: String,
    dateOfBirth: Date,
    phoneNumber: { type: String, required: true },
    countryCode: { type: String, default: '+91' },
    bloodGroup: { type: String },

    // Residential Address
    resAddressLine1: { type: String, required: true },
    resAddressLine2: String,
    resDistrict: { type: String, required: true },
    resPincode: { type: String, required: true },

    // Role Info
    role: { type: String, enum: ['alumni', 'student', 'admin', 'hod', 'faculty'], default: 'alumni' }, // Default to alumni for backward compatibility or change logic
    isAdmin: { type: Boolean, default: false },
    isAlumni: { type: Boolean, default: false }, // Keep for now, but role replaces this usage mostly

    // Student Specific
    currentYear: String, // 1, 2, 3, 4
    semester: String,

    // Placement Info
    isPlaced: { type: Boolean, default: false },
    placedIn: String,
    designation: String,
    companyName: String,

    // Permanent Address
    isPermanentSameAsResidential: { type: Boolean, default: false },
    permAddressLine1: String,
    permAddressLine2: String,
    permDistrict: String,
    permPincode: String,

    linkedInId: String,
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
