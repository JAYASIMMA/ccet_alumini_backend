const express = require('express');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Set up storage engine
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB
}).single('profileImage');


// @route   GET /api/user/all
// @desc    Get all users
router.get('/all', async (req, res) => {
    try {
        // Admin viewing all users - for this feature, including password
        const users = await User.find(); // Removed .select('-password') to allow admin see pass
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/user/:uid
// @desc    Get user by UID
router.get('/:uid', async (req, res) => {
    try {
        const user = await User.findOne({ uid: req.params.uid });
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/user/upload
// @desc    Upload profile image
router.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(400).json({ msg: err });
        } else {
            if (req.file == undefined) {
                res.status(400).json({ msg: 'No File Selected!' });
            } else {
                // Return relative path or construct based on env/request
                // Simpler for now: return relative filename, let frontend handle full URL or return path relative to server root
                // Current frontend uses NetworkImage(url).
                // Best approach for local dev: use the host from the request if possible, or relative path if frontend prepends baseUrl.
                // But frontend likely expects full URL.
                // Let's use relative path '/uploads/filename' and assume frontend *should* prepend baseUrl if it's not absolute, 
                // OR we construct it using the request host.

                const protocol = req.protocol;
                const host = req.get('host');
                const fullUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

                res.json({
                    msg: 'File Uploaded!',
                    file: fullUrl
                });
            }
        }
    });
});

// @route   PUT /api/user/:uid
// @desc    Update user details
router.put('/:uid', async (req, res) => {
    try {
        let user = await User.findOne({ uid: req.params.uid });
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user = await User.findOneAndUpdate(
            { uid: req.params.uid },
            { $set: req.body },
            { new: true }
        );

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/user/:uid/image
// @desc    Delete profile image
router.delete('/:uid/image', async (req, res) => {
    try {
        const user = await User.findOne({ uid: req.params.uid });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // But for MVP just clearing the reference is fine or we can try unlink.
        // Let's just clear the field.
        user.profileImageUrl = null;
        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/user/:uid
// @desc    Delete user
router.delete('/:uid', async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ uid: req.params.uid });
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json({ msg: 'User removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
