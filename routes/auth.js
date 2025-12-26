const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    const {
        email, password, firstName, lastName, department,
        rollNumber, phoneNumber, resAddressLine1, resDistrict, resPincode
    } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
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
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
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
