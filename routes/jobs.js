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

        if (!user.isAdmin && user.role !== 'alumni') {
            return res.status(403).json({ msg: 'Only Admins and Alumni can post jobs' });
        }

        const newJob = new Job({
            title,
            company,
            location,
            type,
            link,
            description,
            postedBy,
            images: req.body.images || [],
            attachments: req.body.attachments || []
        });

        const job = await newJob.save();
        if (req.io) {
            req.io.emit('new_job', job);
        }
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

        const requestUserUid = req.headers['x-user-id']; // Sent from frontend
        const isAdmin = req.headers['x-is-admin'] === 'true';

        console.log(`Delete Job Request - JobID: ${req.params.id}, User: ${requestUserUid}, Admin: ${isAdmin}, JobOwner: ${job.postedBy}`);

        // Permission Check: Admin can delete ALL. User can delete ONLY THEIR OWN.
        if (isAdmin || (requestUserUid && requestUserUid === job.postedBy)) {
            await Job.deleteOne({ _id: req.params.id });
            return res.json({ msg: 'Job removed' });
        }

        return res.status(403).json({ msg: 'Not authorized to delete this job' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/jobs/:id
// @desc    Update a job
router.put('/:id', async (req, res) => {
    try {
        const { title, company, location, type, link, description } = req.body;

        let job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ msg: 'Job not found' });

        const requestUserUid = req.headers['x-user-id']; // Sent from frontend
        // Robust boolean conversion
        const isAdmin = String(req.headers['x-is-admin']).toLowerCase() === 'true';

        console.log(`Update Job Request - ID: ${req.params.id}`);
        console.log(`Headers - UID: ${requestUserUid}, IsAdminHeader: ${req.headers['x-is-admin']}, IsAdminParsed: ${isAdmin}`);
        console.log(`Job PostedBy: ${job.postedBy}`);

        // Permission Check: Admin can edit ALL. User can edit ONLY THEIR OWN.
        // We use loose equality for IDs in case one is weirdly formatted, but strict is better if types match.
        // job.postedBy is likely a String (from schema). requestUserUid is String.
        if (!isAdmin && (!requestUserUid || requestUserUid !== job.postedBy)) {
            console.log('Update Job Failed: Unauthorized');
            return res.status(403).json({ msg: 'Not authorized to edit this job' });
        }

        job.title = title || job.title;
        job.company = company || job.company;
        job.location = location || job.location;
        job.type = type || job.type;
        job.link = link || job.link;
        job.description = description || job.description;

        if (req.body.images) job.images = req.body.images;
        if (req.body.attachments) job.attachments = req.body.attachments;

        await job.save();

        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
