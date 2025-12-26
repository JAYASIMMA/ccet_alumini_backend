const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const User = require('../models/User');

// @route   GET /api/donations/campaigns
// @desc    Get active campaigns (Mock for now, or could be a separate model)
router.get('/campaigns', (req, res) => {
    // In a real app, these might come from a DB
    const campaigns = [
        { id: 1, title: 'Scholarship Fund 2024', description: 'Supporting bright students in need.' },
        { id: 2, title: 'Infrastructure Development', description: 'Building better classrooms and labs.' },
        { id: 3, title: 'Alumni Events Fund', description: 'Funding reunions and networking events.' }
    ];
    res.json(campaigns);
});

// @route   POST /api/donations/donate
// @desc    Make a donation
router.post('/donate', async (req, res) => {
    try {
        const { donorId, amount, campaign, message } = req.body;

        const user = await User.findOne({ uid: donorId });
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const newDonation = new Donation({
            donorName: user.firstName + ' ' + user.lastName,
            donorId,
            amount,
            campaign,
            message
        });

        const donation = await newDonation.save();
        res.json(donation);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/donations/my-donations/:uid
// @desc    Get donations by user
router.get('/my-donations/:uid', async (req, res) => {
    try {
        const donations = await Donation.find({ donorId: req.params.uid }).sort({ date: -1 });
        res.json(donations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
