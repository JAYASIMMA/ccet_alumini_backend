const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const connectDB = require('../db');

// Load env vars
dotenv.config({ path: '../.env' }); // Adjust path if running from scripts/

// Check if running directly or just testing
const createAdmin = async () => {
    await connectDB();

    const username = 'admin'; // Default or change
    const email = 'admin@ccet.com'; // Default or change
    const password = 'admin'; // Default or change

    try {
        let user = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (user) {
            console.log('User already exists. Updating to Admin...');
            user.isAdmin = true;
            user.isAlumni = true;
            user.role = 'admin';
            user.password = password; // Update password if re-running
            await user.save();
            console.log('User updated to Admin.');
        } else {
            console.log('Creating new Admin user...');
            user = new User({
                uid: 'admin_' + Date.now(),
                username,
                email,
                password,
                firstName: 'Admin',
                lastName: 'User',
                department: 'Administration',
                rollNumber: 'ADMIN001',
                phoneNumber: '0000000000',
                resAddressLine1: 'College Office',
                resDistrict: 'Chandigarh',
                resPincode: '160019',
                isAdmin: true,
                isAlumni: true, // Admins treated as alumni/staff for now
                role: 'admin'
            });
            await user.save();
            console.log('Admin user created successfully.');
        }

        console.log(`\nAdmin Credentials:\nUsername: ${username}\nEmail: ${email}\nPassword: ${password}\n`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createAdmin();
