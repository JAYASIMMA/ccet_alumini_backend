const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {

    const {
        email, username, password, firstName, lastName, department,
        rollNumber, phoneNumber, resAddressLine1, resDistrict, resPincode,
        role, currentYear, semester
    } = req.body;

    try {
        let user = await User.findOne({
            $or: [{ email }, { username }]
        });
        if (user) {
            return res.status(400).json({ msg: 'User already exists (Email or Username taken)' });
        }

        // Auto-Admin Logic
        if (req.body.email === 'admin.ccet@gmail.com' || req.body.email === 'admin@ccet@gmail.com') {
            req.body.isAdmin = true;
            req.body.isAlumni = true;
        }

        // Ensure uid is generated if not provided (though frontend usually sends it, or we rely on 'u_' + date)
        // If frontend doesn't send uid, we should generate it.
        if (!req.body.uid) {
            req.body.uid = 'u_' + Date.now();
        }

        user = new User(req.body);
        await user.save();

        res.json({
            success: true,
            user: user
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Simple password check (plaintext for now as requested/MVP)
        if (user.password !== password) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        res.json({
            success: true,
            user: user
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/auth/check/:uid
// @desc    Check if user is registered
router.get('/check/:uid', async (req, res) => {
    try {
        const user = await User.findOne({ uid: req.params.uid });
        if (user) return res.json(true);
        return res.json(false);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
