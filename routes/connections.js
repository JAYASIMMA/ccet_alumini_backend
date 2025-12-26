const express = require('express');
const router = express.Router();
const Connection = require('../models/Connection');
const User = require('../models/User');

// @route   POST /api/connections/request
// @desc    Send a connection request
router.post('/request', async (req, res) => {
    const { requester, recipient } = req.body;

    try {
        // Check if connection already exists
        let connection = await Connection.findOne({
            $or: [
                { requester, recipient },
                { requester: recipient, recipient: requester }
            ]
        });

        if (connection) {
            return res.status(400).json({ msg: 'Connection request already exists or you are already connected.' });
        }

        connection = new Connection({
            requester,
            recipient,
            status: 'pending'
        });

        await connection.save();
        res.json(connection);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/connections/respond
// @desc    Accept or Reject a connection request
router.post('/respond', async (req, res) => {
    const { connectionId, status } = req.body; // status: 'accepted' or 'rejected'

    try {
        let connection = await Connection.findById(connectionId);

        if (!connection) {
            return res.status(404).json({ msg: 'Connection request not found' });
        }

        if (status === 'rejected') {
            await Connection.findByIdAndDelete(connectionId);
            return res.json({ msg: 'Connection request rejected and removed' });
        }

        connection.status = status;
        await connection.save();
        res.json(connection);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/connections/my-connections/:uid
// @desc    Get all accepted connections for a user
router.get('/my-connections/:uid', async (req, res) => {
    try {
        const uid = req.params.uid;
        // Find accepted connections where user is either requester or recipient
        const connections = await Connection.find({
            $or: [{ requester: uid }, { recipient: uid }],
            status: 'accepted'
        });

        // Extract the OTHER user's UID
        const connectedUserIds = connections.map(c =>
            c.requester === uid ? c.recipient : c.requester
        );

        // Fetch details of connected users
        const users = await User.find({ uid: { $in: connectedUserIds } });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/connections/requests/:uid
// @desc    Get pending requests RECEIVED by the user
router.get('/requests/:uid', async (req, res) => {
    try {
        const requests = await Connection.find({
            recipient: req.params.uid,
            status: 'pending'
        });

        // Enrich with requester details
        const requesterIds = requests.map(r => r.requester);
        const users = await User.find({ uid: { $in: requesterIds } });

        // Map users back to request objects
        const detailedRequests = requests.map(r => {
            const user = users.find(u => u.uid === r.requester);
            return { ...r._doc, requesterUser: user };
        });

        res.json(detailedRequests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/connections/status/:uid/:targetUid
// @desc    Check status between two users
router.get('/status/:uid/:targetUid', async (req, res) => {
    try {
        const { uid, targetUid } = req.params;
        const connection = await Connection.findOne({
            $or: [
                { requester: uid, recipient: targetUid },
                { requester: targetUid, recipient: uid }
            ]
        });

        if (!connection) {
            return res.json({ status: 'none' });
        }
        res.json(connection);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
