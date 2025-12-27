const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

// Usage: node create_admin.js [username] [email] [password]
const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ccet_alumini', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected');

        // Defaults
        let username = 'admin';
        let email = 'admin@ccet.com';
        let password = 'admin';

        // Override with args if provided
        const args = process.argv.slice(2);
        if (args.length >= 3) {
            username = args[0];
            email = args[1];
            password = args[2];
        } else if (args.length > 0) {
            console.log('Usage: node create_admin.js [username] [email] [password]');
            console.log('Using defaults...');
        }

        let user = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (user) {
            console.log(`User found (${user.username} / ${user.email}). Promoting to Admin...`);
            user.isAdmin = true;
            user.isAlumni = true;
            user.role = 'admin';
            user.password = password; // Update password
            await user.save();
            console.log('User updated to Admin.');
        } else {
            console.log(`Creating new Admin User: ${username} (${email})...`);
            user = new User({
                uid: 'admin_' + Date.now(),
                username,
                email,
                password,
                firstName: 'Admin',
                lastName: 'User',
                isAdmin: true,
                isAlumni: true,
                department: 'Administration',
                rollNumber: 'ADMIN001',
                phoneNumber: '0000000000',
                resAddressLine1: 'Admin Office',
                resDistrict: 'Campus',
                resPincode: '000000',
                role: 'admin'
            });
            await user.save();
            console.log('Admin user created successfully.');
        }

        console.log(`\nCredentials:\nUsername: ${username}\nEmail: ${email}\nPassword: ${password}\n`);
        process.exit(0);

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createAdmin();
