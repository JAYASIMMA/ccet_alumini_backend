const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected');

        // Get args
        const args = process.argv.slice(2);
        const email = args[0];
        const password = args[1];

        if (!email || !password) {
            console.log('Usage: node create_admin.js <email> <password>');
            process.exit(1);
        }

        let user = await User.findOne({ email });

        if (user) {
            console.log('User exists. Promoting to Admin...');
            user.isAdmin = true;
            await user.save();
            console.log(`User ${email} is now an Admin.`);
        } else {
            console.log('Creating new Admin User...');
            user = new User({
                uid: 'admin_' + Date.now(),
                email,
                password, // Note: Password hashing should be implemented in real app
                firstName: 'Admin',
                lastName: 'User',
                isAdmin: true,
                isAlumni: true,
                department: 'Administration',
                rollNumber: 'ADMIN001',
                phoneNumber: '0000000000',
                resAddressLine1: 'Admin Office',
                resDistrict: 'Campus',
                resPincode: '000000'
            });
            await user.save();
            console.log(`Admin user ${email} created.`);
        }

        process.exit(0);

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createAdmin();
