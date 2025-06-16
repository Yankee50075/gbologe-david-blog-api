const express = require('express');
const router = express.Router();
const BlogPost = require('../models/blogpost');
// ✅ Correct (relative path)
const authenticateToken = require('../middleware/authmiddleware');

// @route   POST /api/posts
// @desc    Create a new blog post
// @access  Private
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const newPost = new BlogPost({
      title,
      content,
      author: req.user.id,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   GET /api/posts
// @desc    Get all blog posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const posts = await BlogPost.find().populate('author', 'username email');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;