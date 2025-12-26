const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');

// @route   GET /api/jobs
// @desc    Get all jobs
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/jobs
// @desc    Create a new job (Admin only)
router.post('/', async (req, res) => {
    try {
        const { title, company, location, type, link, description, postedBy } = req.body;

        const user = await User.findOne({ uid: postedBy });
        if (!user) return res.status(404).json({ msg: 'User not found' });

        if (!user.isAdmin) {
            return res.status(403).json({ msg: 'Only Admins can post jobs' });
        }

        const newJob = new Job({
            title,
            company,
            location,
            type,
            link,
            description,
            postedBy
        });

        const job = await newJob.save();
        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete a job
router.delete('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ msg: 'Job not found' });

        await Job.deleteOne({ _id: req.params.id });
        res.json({ msg: 'Job removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
