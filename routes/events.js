const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');

// @route   GET /api/events
// @desc    Get all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/events
// @desc    Create a new event
router.post('/', async (req, res) => {
    try {
        const { title, description, date, location, organizerId, imageUrl } = req.body;

        // Check if user is Alumni or Admin
        const user = await User.findOne({ uid: organizerId });
        if (!user) return res.status(404).json({ msg: 'User not found' });

        if (!user.isAlumni && !user.isAdmin) {
            return res.status(403).json({ msg: 'Only Alumni and Admins can create events' });
        }

        const newEvent = new Event({
            title,
            description,
            date,
            location,
            organizer: user.firstName + ' ' + user.lastName,
            organizerId,
            imageUrl
        });

        const event = await newEvent.save();
        if (req.io) {
            req.io.emit('new_event', event);
        }
        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/events/:id
// @desc    Delete an event
router.delete('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ msg: 'Event not found' });

        await Event.deleteOne({ _id: req.params.id });
        res.json({ msg: 'Event removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/events/:id
// @desc    Update an event
router.put('/:id', async (req, res) => {
    try {
        const { title, description, date, location, imageUrl } = req.body;

        let event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ msg: 'Event not found' });

        const requestUserUid = req.headers['x-user-id'];
        const isAdmin = String(req.headers['x-is-admin']).toLowerCase() === 'true';

        console.log(`Update Event Request - ID: ${req.params.id}`);
        console.log(`Headers - UID: ${requestUserUid}, IsAdminHeader: ${req.headers['x-is-admin']}, IsAdminParsed: ${isAdmin}`);

        // Permission Check: Admin can edit ALL. User can edit ONLY THEIR OWN.
        if (!isAdmin && (!requestUserUid || requestUserUid !== event.organizerId)) {
            console.log('Update Event Failed: Unauthorized');
            return res.status(403).json({ msg: 'Not authorized to edit this event' });
        }

        event.title = title || event.title;
        event.description = description || event.description;
        event.date = date || event.date;
        event.location = location || event.location;
        if (imageUrl) event.imageUrl = imageUrl;

        await event.save();
        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
