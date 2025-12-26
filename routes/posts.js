const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/posts
// @desc    Create a post
// @access  Public
router.post('/', async (req, res) => {
    try {
        const newPost = new Post({
            authorName: req.body.authorName,
            authorImage: req.body.authorImage,
            content: req.body.content,
            imageUrl: req.body.imageUrl
        });

        const post = await newPost.save();
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private (Admin/Owner) - For now simplified
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ msg: 'Post not found' });

        // In a real app, check user permissions here (req.user)
        // For this implementation, we rely on frontend hiding the button, 
        // or we can add a body param/header to verify admin if we had middleware.
        // Assuming open for now or we can pass an 'adminId' in body to check.

        await Post.deleteOne({ _id: req.params.id });
        res.json({ msg: 'Post removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
