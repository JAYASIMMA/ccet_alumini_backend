const express = require('express');
const router = express.Router();
const News = require('../models/News');

// Get all news
router.get('/', async (req, res) => {
    try {
        const news = await News.find()
            .sort({ date: -1 })
            .populate('author', 'username role profileImage'); // Populate author details
        res.json(news);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new news
router.post('/', async (req, res) => {
    const { title, content, department, image, author, links } = req.body;

    // Validate required fields
    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }

    const news = new News({
        title,
        content,
        department,
        image,
        author,
        links
    });

    try {
        const newNews = await news.save();

        // Populate and return the created news
        const populatedNews = await News.findById(newNews._id).populate('author', 'username role profileImage');
        res.status(201).json(populatedNews);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update news
router.put('/:id', async (req, res) => {
    try {
        const userHeader = req.headers['x-user-id'];
        const isAdminHeader = req.headers['x-is-admin'] === 'true';
        const userDeptHeader = req.headers['x-user-department'];

        const news = await News.findById(req.params.id);
        if (!news) return res.status(404).json({ message: 'News not found' });

        // Permission check: Admin can update all; HOD/Faculty can update their department's news
        const isAuthor = news.author && news.author.toString() === userHeader;
        const isSameDept = news.department === userDeptHeader;

        if (!isAdminHeader && !isAuthor && !isSameDept) {
            return res.status(403).json({ message: 'Not authorized to update this news' });
        }

        const updatedNews = await News.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        ).populate('author', 'username role profileImage');

        res.json(updatedNews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete news
router.delete('/:id', async (req, res) => {
    try {
        const userHeader = req.headers['x-user-id'];
        const isAdminHeader = req.headers['x-is-admin'] === 'true';
        const userDeptHeader = req.headers['x-user-department'];

        const news = await News.findById(req.params.id);
        if (!news) return res.status(404).json({ message: 'News not found' });

        // Permission check: Admin can delete all; Author or Same Dept HOD/Faculty
        const isAuthor = news.author && news.author.toString() === userHeader;
        const isSameDept = news.department === userDeptHeader;

        if (!isAdminHeader && !isAuthor && !isSameDept) {
            return res.status(403).json({ message: 'Not authorized to delete this news' });
        }

        await News.findByIdAndDelete(req.params.id);
        res.json({ message: 'News deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
