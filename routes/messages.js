const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Connection = require('../models/Connection');

// Middleware to check if users are connected could be added here

// @route   POST /api/messages/send
// @desc    Send a message
router.post('/send', async (req, res) => {
    const { sender, recipient, content } = req.body;

    try {
        // Verify connection exists (optional but recommended)
        const connection = await Connection.findOne({
            $or: [
                { requester: sender, recipient: recipient, status: 'accepted' },
                { requester: recipient, recipient: sender, status: 'accepted' }
            ]
        });

        if (!connection) {
            return res.status(403).json({ msg: 'You are not connected with this user.' });
        }

        const newMessage = new Message({
            sender,
            recipient,
            content
        });

        const msg = await newMessage.save();
        res.json(msg);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/messages/:uid/:targetUid
// @desc    Get conversation between two users
router.get('/:uid/:targetUid', async (req, res) => {
    try {
        const { uid, targetUid } = req.params;
        const messages = await Message.find({
            $or: [
                { sender: uid, recipient: targetUid },
                { sender: targetUid, recipient: uid }
            ]
        }).sort({ timestamp: 1 }); // Oldest first

        res.json(messages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
